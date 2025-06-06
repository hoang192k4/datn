<?php

use App\Http\Controllers\Product\ProductController;
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
    ->prefix('course_offers')
    ->group(function () {
        Route::get('/getstudents/{course_offer_id}','getStudentsByCourseOffer');
    });