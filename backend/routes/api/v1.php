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
         Route::post('/update-profile', 'update');
    });


Route::controller(App\Http\Controllers\Auth\StudentAuthController::class)
    ->prefix('students')
    ->group(function () {
        Route::post('/login', 'login')->name('login');
        Route::post('/refresh', 'refresh')->name('refresh');
        Route::get('/me', 'me')->name('me');
        Route::post('/logout', 'logout')->name('logout');
    });


Route::controller(App\Http\Controllers\Grade\GradeController::class)
    ->prefix('grades')
    ->group(function () {
        Route::get('/', 'getGradesByCourseSection');
        Route::post('/grade-column', 'createGradeColumn');
        Route::post('/', 'create');
        Route::put('/{id}', 'updateOrCreateGrade');
        Route::get('/calculate', 'calculate');
    });

Route::controller(App\Http\Controllers\SummaryGrade\SummaryGradeController::class)
    ->prefix('summary-grades')
    ->group(function () {
        Route::put('/{id}', 'update');
    });


Route::controller(App\Http\Controllers\Attendance\AttendanceController::class)
    ->prefix('course-section-attendances')
    ->group(function () {
        Route::get('/{courseSectionId}/students', 'getStudentsByCourseSection');
        Route::post('/', 'storeAttendanceStudents');
        Route::get('/{courseSectionId}/attendances', 'getAllAttendanceByCourseSection');
    });


Route::controller(App\Http\Controllers\DeviceToken\DeviceTokenController::class)
    ->prefix('device-token')
    ->group(function () {
        Route::post('/', 'update');
    });



Route::controller(App\Http\Controllers\Notification\NotificationController::class)
    ->prefix('notifications')
    ->group(function () {
        Route::post('/', 'sendNotifications');
        Route::post('/send-to-course-section', 'sendNotificationToCourseSection');
        Route::post('/send-test', 'sendNotification');
        Route::get('/', 'getMyNotifications');
    });

Route::controller(App\Http\Controllers\Notification\StudentNotificationController::class)
    ->prefix('feedbacks')
    ->group(function () {
        Route::post('/', 'sendFeedbackToTeacher');
    });

Route::controller(App\Http\Controllers\Post\PostController::class)
    ->prefix('posts')
    ->group(function () {
        Route::get('/', 'getPostByTeacherSlug');
    });
Route::controller(App\Http\Controllers\Auth\AuthController::class)
    ->prefix('auth')
    ->group(function () {
        Route::get('/me', 'me');
        Route::post('/refresh', 'refresh');
    });
