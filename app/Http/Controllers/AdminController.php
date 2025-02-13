<?php

namespace App\Http\Controllers;

use App\Models\Option;
use App\Models\Question;
use App\Models\Survey;
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

        $password = 'password';

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
            "uuid" => $request->uuid,
            "title" => $request->survey["title"] ?? "Untitled form",
            "description" => $request->survey["description"],
            "limit" => $request->survey["limit"],
        ]);

        foreach ($request->survey["questions"] as $questionData) {
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
}
