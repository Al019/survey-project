<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ViewerController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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

    Route::get('/admin/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

    Route::get('/admin/enumerators/list', function () {
        return Inertia::render('Admin/Enumerator/List');
    })->name('admin.enumerator.list');
    Route::get('/admin/enumerators/view', function () {
        return Inertia::render('Admin/Enumerator/View');
    })->name('admin.view.enumerator');

    Route::get('/admin/viewers', function () {
        return Inertia::render('Admin/Viewer/List');
    })->name('admin.viewer.list');
    Route::get('/admin/viewers/view', function () {
        return Inertia::render('Admin/Viewer/View');
    })->name('admin.view.viewer');

    Route::get('/admin/surveys', function () {
        return Inertia::render('Admin/Survey/List');
    })->name('admin.survey.list');
    Route::get('/admin/surveys/create', function () {
        return Inertia::render('Admin/Survey/Create');
    })->name('admin.survey.create');
    Route::get('/admin/surveys/view', function () {
        return Inertia::render('Admin/Survey/View');
    })->name('admin.view.survey');

});

Route::middleware(['auth', 'enumerator'])->group(function () {

    Route::get('/enumerator/dashboard', function () {
        return Inertia::render('Enumerator/Dashboard');
    })->name('enumerator.dashboard');

    Route::get('/enumerator/surveys', function () {
        return Inertia::render('Enumerator/Survey/List');
    })->name('enumerator.survey.list');
    Route::get('/enumerator/surveys/view', function () {
        return Inertia::render('Enumerator/Survey/View');
    })->name('enumerator.view.survey');

});

Route::middleware(['auth', 'viewer'])->group(function () {

    Route::get('/viewer/dashboard', function () {
        return Inertia::render('Viewer/Dashboard');
    })->name('viewer.dashboard');
    Route::get('/viewer/surveys', function () {
        return Inertia::render('Viewer/Survey/List');
    })->name('viewer.survey.list');
    Route::get('/viewer/surveys/view', function () {
        return Inertia::render('Viewer/Survey/View');
    })->name('viewer.view.survey');

});

require __DIR__ . '/auth.php';
require __DIR__ . '/api.php';
