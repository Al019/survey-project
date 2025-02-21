<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\AnswerOption;
use App\Models\Response;
use App\Models\Survey;
use Illuminate\Http\Request;

class EnumeratorController extends Controller
{
    public function surveyList()
    {
        $user_id = auth()->user()->id;

        $surveys = Survey::whereHas('survey_assignment', function ($query) use ($user_id) {
            $query->where('enumerator_id', $user_id);
        })
            ->withCount([
                'response as total_response_count' => function ($query) {
                    $query->whereHas('answer');
                },
                'response as enumerator_response_count' => function ($query) use ($user_id) {
                    $query->where('enumerator_id', $user_id);
                    $query->whereHas('answer');
                }
            ])
            ->latest()
            ->get();

        return response()->json($surveys);
    }

    public function viewSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::where('id', $request->survey_id)
            ->whereHas('survey_assignment', function ($query) use ($user_id) {
                $query->where('enumerator_id', $user_id);
            })
            ->withCount([
                'response as total_response_count' => function ($query) {
                    $query->whereHas('answer');
                },
                'response as enumerator_response_count' => function ($query) use ($user_id) {
                    $query->where('enumerator_id', $user_id);
                    $query->whereHas('answer');
                }
            ])
            ->with('question.option')
            ->first();

        return response()->json($survey);
    }

    public function getResponse(Request $request)
    {
        $user_id = auth()->user()->id;

        $responses = Response::where('survey_id', $request->survey_id)
            ->where('enumerator_id', $user_id)
            ->with('answer.answer_option')
            ->get();

        return response()->json($responses);
    }

    public function submitResponse(Request $request)
    {
        $user_id = auth()->user()->id;

        $response = Response::create([
            'survey_id' => $request->survey_id,
            'enumerator_id' => $user_id,
        ]);

        foreach ($request['answer'] as $answerData) {
            $answer = Answer::create(attributes: [
                'response_id' => $response->id,
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

}
