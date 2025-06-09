<?php

use App\Http\Controllers\CourseOffer\CourseOfferController;
use Illuminate\Support\Facades\Route;

Route::controller(App\Http\Controllers\Auth\TeacherAuthController::class)
    ->prefix('teachers')
    ->group(function () {
        Route::post('/login', 'login')->name('login');
        Route::post('/refresh', 'refresh')->name('refresh');
        Route::get('/me', 'me')->name('me');
        Route::post('/logout', 'logout')->name('logout');
        Route::post('/change-password', 'changePassword');
    });


Route::controller(App\Http\Controllers\Auth\StudentAuthController::class)
    ->prefix('students')
    ->group(function () {
        Route::post('/login', 'login')->name('login');
        Route::post('/refresh', 'refresh')->name('refresh');
        Route::get('/me', 'me')->name('me');
        Route::post('/logout', 'logout')->name('logout');
    });

Route::controller(CourseOfferController::class)
    ->prefix('course-offers')
    ->group(function () {
        Route::get('/{courseOfferId}/students', 'getStudentsByCourseOffer');
    });

Route::controller(App\Http\Controllers\Grade\GradeController::class)
    ->prefix('grades')
    ->group(function () {
        Route::get('/', 'getGradesByCourseOffer');
        Route::post('/grade-column', 'createGradeColumn');
        Route::post('/', 'create');
        Route::put('/{id}', 'updateOrCreateGrade');
        Route::get('/calculate', 'calculate');
    });


Route::controller(App\Http\Controllers\Attendance\AttendanceController::class)
    ->prefix('course-offer-attendances')
    ->group(function () {
        Route::get('/{courseOfferId}/students', 'getStudentsByCourseOffer');
        Route::post('/', 'storeAttendanceStudents');
        Route::get('/{courseOfferId}/attendances', 'getAllAttendanceByCourseOffer');
    });
