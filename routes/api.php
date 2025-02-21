<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\EnumeratorController;
use App\Http\Controllers\ViewerController;

Route::middleware(['auth', 'admin'])->group(function () {

  Route::get('/api/admin/enumerators/list', [AdminController::class, 'enumeratorList'])->name('api.admin.enumerator.list');
  Route::post('/api/admin/enumerators', [AdminController::class, 'addEnumerator'])->name('api.admin.add.enumerator');
  Route::get('/api/admin/enumerators/view', [AdminController::class, 'viewEnumerator'])->name('api.admin.view.enumerator');

  Route::get('/api/admin/viewers', [AdminController::class, 'viewerList'])->name('api.admin.viewer.list');
  Route::post('/api/admin/viewers', [AdminController::class, 'addViewer'])->name('api.admin.add.viewer');
  Route::get('/api/admin/viewers/view', [AdminController::class, 'viewViewer'])->name('api.admin.view.viewer');

  Route::get('/api/admin/surveys/list', [AdminController::class, 'surveyList'])->name('api.admin.survey.list');
  Route::post('/api/admin/surveys/publish', [AdminController::class, 'publishSurvey'])->name('api.admin.publish.survey');
  Route::get('/api/admin/surveys/view', [AdminController::class, 'viewSurvey'])->name('api.admin.view.survey');
  Route::get('/api/admin/surveys/enumerators', [AdminController::class, 'getEnumerator'])->name('api.admin.survey.enumerator');
  Route::post('/api/admin/surveys/assign/enumerator', [AdminController::class, 'assignEnumerator'])->name('api.admin.assign.enumerator');
  Route::post('/api/admin/surveys/delete/survey', [AdminController::class, 'deleteSurvey'])->name('api.admin.delete.survey');
  Route::get('/api/admin/surveys/export/reponses', [AdminController::class, 'exportResponse'])->name('api.admin.export.response');

});

Route::middleware(['auth', 'enumerator'])->group(function () {

  Route::get('/api/enumerator/surveys', [EnumeratorController::class, 'surveyList'])->name('api.enumerator.survey.list');
  Route::get('/api/enumerator/surveys/view', [EnumeratorController::class, 'viewSurvey'])->name('api.enumerator.view.survey');
  Route::get('/api/enumerator/surveys/responses', [EnumeratorController::class, 'getResponse'])->name('api.enumerator.survey.response');
  Route::post('/api/enumerator/surveys/submit/response', [EnumeratorController::class, 'submitResponse'])->name('api.enumerator.submit.response');

});

Route::middleware(['auth', 'viewer'])->group(function () {

  Route::get('/api/viewer/surveys', [ViewerController::class, 'surveyList'])->name('api.viewer.survey.list');
  Route::get('/api/viewer/surveys/view', [ViewerController::class, 'viewSurvey'])->name('api.viewer.view.survey');

});