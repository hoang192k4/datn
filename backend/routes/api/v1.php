<?php

use Illuminate\Support\Facades\Route;

Route::controller(App\Http\Controllers\Auth\TeacherAuthController::class)
    ->prefix('teachers')
    ->group(function () {
        Route::post('/login', 'login')->name('login');
        Route::post('/refresh', 'refresh')->name('refresh');
        Route::get('/me', 'me')->name('me');
        Route::post('/logout', 'logout')->name('logout');
    });


Route::controller(App\Http\Controllers\Auth\StudentAuthController::class)
    ->prefix('students')
    ->group(function () {
        Route::post('/login', 'login');
        Route::get('/me', 'me');
    });

Route::controller(App\Http\Controllers\CourseOffer\CourseOfferController::class)
    ->prefix('course-offers')
    ->group(function () {
        Route::get('/{courseOfferId}/students', 'getStudentsByCourseOffer');
    });

Route::controller(App\Http\Controllers\Grade\GradeController::class)
    ->prefix('grades')
    ->group(function () {
        Route::get('/', 'getGradesByCourseOffer');
    });


Route::controller(App\Http\Controllers\Attendance\AttendanceController::class)
    ->prefix('course-offer-attendances')
    ->group(function () {
        Route::get('/{courseOfferId}/students', 'getStudentsByCourseOffer');
        Route::post('/attendance-students', 'storeAttendanceStudents');
        Route::get('/{courseOfferId}/allAttendances','getAllAttendanceByCourseOffer');
    });
