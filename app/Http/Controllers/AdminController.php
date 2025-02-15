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

class AdminController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function enumeratorList()
    {
        $enumerators = User::where("role", "enumerator")
            ->get();

        return Inertia::render('Admin/Enumerator/List', [
            'enumerators' => $enumerators,
        ]);
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

    public function surveyList()
    {
        $surveys = Survey::withCount('response')
            ->latest()
            ->get();

        return Inertia::render('Admin/Survey/List', [
            'surveys' => $surveys,
        ]);
    }

    public function surveyCreate()
    {
        return Inertia::render('Admin/Survey/Create');
    }

    public function publishSurvey(Request $request)
    {
        $user_id = auth()->user()->id;

        $survey = Survey::create([
            "admin_id" => $user_id,
            "title" => $request["title"] ?? "Untitled form",
            "description" => $request["description"],
            "limit" => $request["limit"],
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
            ->withCount('response')
            ->with('question.option')
            ->first();

        if (!$survey) {
            abort(404);
        }

        $responses = Response::where('survey_id', $survey->id)
            ->with('answer.answer_option')
            ->get();

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
                }
            ])
            ->get();

        return Inertia::render('Admin/Survey/View', [
            'survey' => $survey,
            'responses' => $responses,
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
}
