<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\AnswerOption;
use App\Models\Response;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;
use PhpOffice\PhpSpreadsheet\Style\Protection;

class EnumeratorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Enumerator/Dashboard');
    }

    public function surveyList()
    {
        $user_id = auth()->user()->id;

        $surveys = Survey::whereHas('survey_assignment', function ($query) use ($user_id) {
            $query->where('enumerator_id', $user_id);
        })
            ->withCount([
                'response as total_response_count',
                'response as enumerator_response_count' => function ($query) use ($user_id) {
                    $query->where('enumerator_id', $user_id);
                }
            ])
            ->latest()
            ->get();

        return Inertia::render('Enumerator/Survey/List', [
            'surveys' => $surveys,
        ]);
    }

    public function viewSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::where('id', $request->survey_id)
            ->whereHas('survey_assignment', function ($query) use ($user_id) {
                $query->where('enumerator_id', $user_id);
            })
            ->withCount([
                'response as total_response_count',
                'response as enumerator_response_count' => function ($query) use ($user_id) {
                    $query->where('enumerator_id', $user_id);
                }
            ])
            ->with('question.option')
            ->first();

        if (!$survey) {
            abort(404);
        }

        $responses = Response::where('survey_id', $survey->id)
            ->where('enumerator_id', $user_id)
            ->with('answer.answer_option')
            ->get();

        return Inertia::render('Enumerator/Survey/View', [
            'survey' => $survey,
            'responses' => $responses,
        ]);
    }

    public function submitSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $reponse = Response::create([
            'survey_id' => $request->survey_id,
            'enumerator_id' => $user_id,
        ]);

        foreach ($request['answer'] as $answerData) {
            $answer = Answer::create([
                'response_id' => $reponse->id,
                'question_id' => $answerData['questionId'],
                'text' => is_array($answerData['text']) ? implode(', ', $answerData['text']) : $answerData['text'],
            ]);

            foreach ($answerData['option'] as $answerOptionData) {
                AnswerOption::create([
                    'answer_id' => $answer->id,
                    'option_id' => $answerOptionData['optionId'],
                ]);
            }
        }
    }

    public function exportAnswerSheet(Request $request)
    {
        $survey = Survey::where('id', $request->survey_id)
            ->with('question.option')
            ->first();

        if (!$survey) {
            abort(404);
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $hiddenSheet = $spreadsheet->createSheet();
        $hiddenSheet->setTitle('Options'); // Ensure options sheet is created

        // Headers
        $sheet->setCellValue('A1', 'ID');
        $sheet->setCellValue('B1', 'Question Type');
        $sheet->setCellValue('C1', 'Question');
        $sheet->setCellValue('D1', 'Answer'); // Will expand dynamically

        // Set column widths
        $sheet->getColumnDimension('A')->setWidth(10);
        $sheet->getColumnDimension('B')->setWidth(20);
        $sheet->getColumnDimension('C')->setWidth(30);
        $sheet->getColumnDimension('D')->setWidth(20);
        $sheet->getStyle('C')->getAlignment()->setWrapText(true);
        $sheet->getStyle('D')->getAlignment()->setWrapText(true);

        // Lock Columns A and B (Make Read-Only)
        $sheet->getProtection()->setSheet(true);
        $sheet->getStyle('A:B')->getProtection()->setLocked(Protection::PROTECTION_PROTECTED);
        $sheet->getStyle('C:D')->getProtection()->setLocked(Protection::PROTECTION_UNPROTECTED);

        $row = 2;
        $optionRow = 1; // Start row for options

        foreach ($survey->question as $question) {
            $sheet->setCellValue("A{$row}", $question->id);
            $sheet->setCellValue("B{$row}", ucfirst($question->type)); // Capitalized type
            $sheet->setCellValue("C{$row}", $question->text);

            if (in_array($question->type, ['radio', 'select', 'checkbox', 'multi-select']) && count($question->option) > 0) {
                // Store answer choices in the hidden sheet
                $options = array_column($question->option->toArray(), 'text');

                foreach ($options as $index => $option) {
                    $hiddenSheet->setCellValue("A" . ($optionRow + $index), $option);
                }

                $startCell = "A{$optionRow}";
                $endCell = "A" . ($optionRow + count($options) - 1);
                $excelRange = "Options!$" . $startCell . ":$" . $endCell; // Absolute range

                if (in_array($question->type, ['radio', 'select'])) {
                    // Only ONE column for Radio and Select types
                    $col = 'D';

                    $sheet->setCellValue(
                        "{$col}1",
                        "Answer"
                    );
                    $sheet->getColumnDimension($col)->setWidth(20);
                    $sheet->getStyle($col)->getAlignment()->setWrapText(true);
                    $sheet->getStyle($col)->getProtection()->setLocked(Protection::PROTECTION_UNPROTECTED);

                    // Apply Dropdown Validation (Only One Answer Allowed)
                    $validation = $sheet->getCell("{$col}{$row}")->getDataValidation();
                    $validation->setType(DataValidation::TYPE_LIST);
                    $validation->setErrorStyle(DataValidation::STYLE_INFORMATION);
                    $validation->setAllowBlank(false);
                    $validation->setShowDropDown(true);
                    $validation->setFormula1($excelRange);
                } elseif (in_array($question->type, ['checkbox'])) {
                    // Multi-select (Expands to D, E, F)
                    $maxOptions = count($options);
                    $columns = range('D', chr(68 + $maxOptions - 1));

                    foreach ($columns as $col) {
                        $sheet->setCellValue("{$col}1", "Answer " . (ord($col) - 67));
                        $sheet->getColumnDimension($col)->setWidth(20);
                        $sheet->getStyle($col)->getAlignment()->setWrapText(true);
                        $sheet->getStyle($col)->getProtection()->setLocked(Protection::PROTECTION_UNPROTECTED);

                        $validation = $sheet->getCell("{$col}{$row}")->getDataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_INFORMATION);
                        $validation->setAllowBlank(false);
                        $validation->setShowDropDown(true);
                        $validation->setFormula1($excelRange);
                    }
                }

                $optionRow += count($options); // Move to the next available row in the hidden sheet
            }

            $row++;
        }

        $hiddenSheet->setSheetState(\PhpOffice\PhpSpreadsheet\Worksheet\Worksheet::SHEETSTATE_HIDDEN);

        // Save to storage
        $fileName = $survey->title . ' ' . 'Answer Sheet.xlsx';
        $filePath = storage_path("app/public/{$fileName}");
        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        return response()->download($filePath, $fileName)->deleteFileAfterSend();
    }
}
