<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\EnumeratorController;
use App\Http\Controllers\ProfileController;
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
    Route::get('/admin/surveys', [AdminController::class, 'surveyList'])->name('admin.survey.list');
    Route::get('/admin/surveys/create', [AdminController::class, 'surveyCreate'])->name('admin.survey.create');
    Route::post('/admin/surveys/create', [AdminController::class, 'publishSurvey'])->name('admin.publish.survey');
    Route::get('/admin/surveys/view', [AdminController::class, 'viewSurvey'])->name('admin.view.survey');
    Route::post('/admin/surveys/view', [AdminController::class, 'assignEnumerator'])->name('admin.assign.enumerator');
});

Route::middleware(['auth', 'enumerator'])->group(function () {
    Route::get('/enumerator/dashboard', [EnumeratorController::class, 'dashboard'])->name('enumerator.dashboard');
    Route::get('/enumerator/surveys', [EnumeratorController::class, 'surveyList'])->name('enumerator.survey.list');
    Route::get('/enumerator/surveys/view', [EnumeratorController::class, 'viewSurvey'])->name('enumerator.view.survey');
    Route::post('/enumerator/surveys/view', [EnumeratorController::class, 'submitSurvey'])->name('enumerator.submit.survey');
});

require __DIR__ . '/auth.php';
