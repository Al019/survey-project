<?php

namespace App\Http\Controllers;

use App\Models\Response;
use App\Models\Survey;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ViewerController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Viewer/Dashboard');
    }

    public function surveyList()
    {
        $surveys = Survey::withCount('response', 'survey_assignment as assign_count')
            ->latest()
            ->get();

        return Inertia::render('Viewer/Survey/List', [
            'surveys' => $surveys,
        ]);
    }

    public function viewSurvey(Request $request)
    {
        $survey = Survey::where('id', $request->survey_id)
            ->withCount('response')
            ->with('question.option')
            ->first();

        if (!$survey) {
            abort(404);
        }

        $responses = Response::where('survey_id', $survey->id)
            ->with('answer.answer_option')
            ->get();

        $assignEnumerators = User::where('role', 'enumerator')
            ->whereHas('survey_assignment', function ($query) use ($survey) {
                $query->where('survey_id', $survey->id);
            })
            ->withCount([
                'response' => function ($query) use ($survey) {
                    $query->where('survey_id', $survey->id);
                }
            ])
            ->get();

        return Inertia::render('Viewer/Survey/View', [
            'survey' => $survey,
            'responses' => $responses,
            'assignEnumerators' => $assignEnumerators,
        ]);
    }
}
