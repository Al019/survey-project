<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Question;
use App\Models\Response;
use App\Models\Survey;
use App\Models\SurveyAssignment;
use App\Models\User;
use Hash;
use Illuminate\Http\Request;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class AdminController extends Controller
{
    public function enumeratorList()
    {
        $enumerators = User::where("role", "enumerator")
            ->get();

        return response()->json($enumerators);
    }

    public function addEnumerator(Request $request)
    {
        $request->validate([
            'last_name' => ['required'],
            'first_name' => ['required'],
            'gender' => ['required'],
            'email' => ['required', 'email', 'unique:users'],
        ]);

        // $password = Str::random(8);

        $password = "P@ssw0rd";

        User::create([
            "last_name" => $request->last_name,
            "first_name" => $request->first_name,
            "middle_name" => $request->middle_name,
            "gender" => $request->gender,
            "email" => $request->email,
            'password' => Hash::make($password),
            "role" => "enumerator",
        ]);

        // Mail::to($request->email)->send(new PasswordMail($password));
    }

    public function viewEnumerator(Request $request)
    {
        $enumerator = User::where("id", $request->enumerator_id)
            ->where("role", "enumerator")
            ->first();

        return response()->json($enumerator);
    }

    public function viewerList()
    {
        $viewers = User::where("role", "viewer")
            ->get();

        return response()->json($viewers);
    }

    public function viewViewer(Request $request)
    {
        $viewer = User::where("id", $request->viewer_id)
            ->where("role", "viewer")
            ->first();

        return response()->json($viewer);
    }

    public function addViewer(Request $request)
    {
        $request->validate([
            'last_name' => ['required'],
            'first_name' => ['required'],
            'gender' => ['required'],
            'email' => ['required', 'email', 'unique:users'],
        ]);

        // $password = Str::random(8);

        $password = "P@ssw0rd";

        User::create([
            "last_name" => $request->last_name,
            "first_name" => $request->first_name,
            "middle_name" => $request->middle_name,
            "gender" => $request->gender,
            "email" => $request->email,
            'password' => Hash::make($password),
            "role" => "viewer",
        ]);

        // Mail::to($request->email)->send(new PasswordMail($password));
    }

    public function surveyList(Request $request)
    {
        $surveys = Survey::withCount([
            'survey_assignment as assign_count',
            'response' => function ($query) {
                $query->whereHas('answer');
            }
        ])
            ->latest()
            ->get();

        return response()->json($surveys);
    }

    public function publishSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::create([
            "admin_id" => $user_id,
            "title" => $request["title"] ?? "Untitled form",
            "description" => $request["description"],
        ]);

        foreach ($request["questions"] as $questionData) {
            $question = Question::create([
                'survey_id' => $survey->id,
                'text' => $questionData['text'],
                'type' => $questionData['type'],
                'required' => $questionData['required'],
            ]);

            foreach ($questionData["options"] as $optionData) {
                Option::create([
                    'question_id' => $question->id,
                    'text' => $optionData['text'],
                ]);
            }
        }
    }

    public function viewSurvey(Request $request)
    {
        $survey = Survey::where('id', $request->survey_id)
            ->withCount([
                'response' => function ($query) {
                    $query->whereHas('answer');
                }
            ])
            ->with('question.option')
            ->first();

        $responses = Response::where('survey_id', $survey->id)
            ->with('answer.answer_option')
            ->get();

        return response()->json([
            'survey' => $survey,
            'responses' => $responses,
        ]);
    }

    public function getEnumerator(Request $request)
    {
        $survey = Survey::where('id', $request->survey_id)
            ->first();

        $notAssignEnumerators = User::where('role', 'enumerator')
            ->whereDoesntHave('survey_assignment', function ($query) use ($survey) {
                $query->where('survey_id', $survey->id);
            })
            ->get();

        $assignEnumerators = User::where('role', 'enumerator')
            ->whereHas('survey_assignment', function ($query) use ($survey) {
                $query->where('survey_id', $survey->id);
            })
            ->withCount([
                'response' => function ($query) use ($survey) {
                    $query->where('survey_id', $survey->id);
                    $query->whereHas('answer');
                }
            ])
            ->get();

        return response()->json([
            'notAssignEnumerators' => $notAssignEnumerators,
            'assignEnumerators' => $assignEnumerators,
        ]);
    }

    public function assignEnumerator(Request $request)
    {
        SurveyAssignment::create([
            'survey_id' => $request->survey_id,
            'enumerator_id' => $request->enumerator_id,
        ]);
    }

    public function deleteSurvey(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        Survey::find($request->survey_id)
            ->delete();
    }

    public function exportResponse(Request $request)
    {
        $survey = Survey::where('id', $request->survey_id)->first();

        $responses = Response::with('answer.question')->where('survey_id', $survey->id)->get();
        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();

        $questions = Question::where('survey_id', $survey->id)->get();

        $columnHeaders = $questions->pluck('text')->toArray();
        $sheet->fromArray($columnHeaders, null, 'A1');

        $row = 2;
        foreach ($responses as $response) {
            $responseData = [];
            foreach ($questions as $question) {
                $answer = $response->answer->where('question_id', $question->id)->first();
                $responseData[] = $answer ? $answer->text : '';
            }
            $sheet->fromArray($responseData, null, 'A' . $row++);
        }

        $fileName = $survey->title . ' ' . 'Responses.xlsx';
        $filePath = storage_path("app/public/{$fileName}");
        $writer = new Xlsx($spreadsheet);
        $writer->save($filePath);

        return response()->download($filePath, $fileName)->deleteFileAfterSend();
    }
}
