<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\AnswerOption;
use App\Models\Response;
use App\Models\Survey;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
            ->withCount('response')
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
            ->withCount('response')
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
}
