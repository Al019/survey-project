<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\EnumeratorController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
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

    return abort(403);
});

// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard');
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
});

Route::middleware(['auth', 'enumerator'])->group(function () {
    Route::get('/enumerator/dashboard', [EnumeratorController::class, 'dashboard'])->name('enumerator.dashboard');
});

require __DIR__ . '/auth.php';
