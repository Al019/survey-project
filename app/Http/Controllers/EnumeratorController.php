<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class EnumeratorController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Enumerator/Dashboard');
    }
}
