<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\EnumeratorController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ViewerController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    if (!Auth::check()) {
        return redirect(route('login'));
    }

    if (Auth::user()->role === 'admin') {
        return redirect(route('admin.dashboard'));
    }

    if (Auth::user()->role === 'enumerator') {
        return redirect(route('enumerator.dashboard'));
    }

    if (Auth::user()->role === 'viewer') {
        return redirect(route('viewer.dashboard'));
    }

    return abort(403);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'information'])->name('profile.information');
    Route::post('/profile', [ProfileController::class, 'changePassword'])->name('profile.change.password');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/admin/enumerators', [AdminController::class, 'enumeratorList'])->name('admin.enumerator.list');
    Route::post('/admin/enumerators', [AdminController::class, 'addEnumerator'])->name('admin.add.enumerator');
    Route::get('/admin/enumerators/view', [AdminController::class, 'viewEnumerator'])->name('admin.view.enumerator');
    Route::post('/admin/enumerators/view', [AdminController::class, 'deleteEnumerator'])->name('admin.delete.enumerator');
    Route::get('/admin/viewers', [AdminController::class, 'viewerList'])->name('admin.viewer.list');
    Route::post('/admin/viewers', [AdminController::class, 'addViewer'])->name('admin.add.viewer');
    Route::get('/admin/surveys', [AdminController::class, 'surveyList'])->name('admin.survey.list');
    Route::get('/admin/surveys/create', [AdminController::class, 'surveyCreate'])->name('admin.survey.create');
    Route::post('/admin/surveys/create', [AdminController::class, 'createSurvey'])->name('admin.create.survey');
    Route::post('/admin/surveys/publish', [AdminController::class, 'publishSurvey'])->name('admin.publish.survey');
    Route::get('/admin/surveys/view', [AdminController::class, 'viewSurvey'])->name('admin.view.survey');
    Route::post('/admin/surveys/view/assign/enumerator', [AdminController::class, 'assignEnumerator'])->name('admin.assign.enumerator');
    Route::post('/admin/surveys/view/delete/survey', [AdminController::class, 'deleteSurvey'])->name('admin.delete.survey');
    Route::get('/admin/surveys/view/export/reponses', [AdminController::class, 'exportResponse'])->name('admin.export.response');
});

Route::middleware(['auth', 'enumerator'])->group(function () {
    Route::get('/enumerator/dashboard', [EnumeratorController::class, 'dashboard'])->name('enumerator.dashboard');
    Route::get('/enumerator/surveys', [EnumeratorController::class, 'surveyList'])->name('enumerator.survey.list');
    Route::get('/enumerator/surveys/view', [EnumeratorController::class, 'viewSurvey'])->name('enumerator.view.survey');
    Route::post('/enumerator/surveys/view', [EnumeratorController::class, 'submitResponse'])->name('enumerator.submit.response');
    Route::post('/enumerator/surveys/submit/answer', [EnumeratorController::class, 'submitAnswer'])->name('enumerator.submit.answer');
    Route::get('/enumerator/surveys/export/answer/sheet', [EnumeratorController::class, 'exportAnswerSheet'])->name('enumerator.export.answer.sheet');
});

Route::middleware(['auth', 'viewer'])->group(function () {
    Route::get('/viewer/dashboard', [ViewerController::class, 'dashboard'])->name('viewer.dashboard');
    Route::get('/viewer/surveys', [ViewerController::class, 'surveyList'])->name('viewer.survey.list');
    Route::get('/viewer/surveys/view', [ViewerController::class, 'viewSurvey'])->name('viewer.view.survey');
});

require __DIR__ . '/auth.php';
