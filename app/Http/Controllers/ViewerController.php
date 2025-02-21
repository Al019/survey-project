<?php

namespace App\Http\Controllers;

use App\Models\Response;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewerController extends Controller
{
    public function surveyList()
    {
        $surveys = Survey::whereHas('survey_assignment')
            ->withCount([
                'response' => function ($query) {
                    $query->whereHas('answer');
                }
            ])
            ->latest()
            ->get();

        return response()->json($surveys);
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
}
