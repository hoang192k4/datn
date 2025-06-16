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


Route::controller(App\Http\Controllers\Subject\SubjectController::class)
    ->prefix('subjects')
    ->group(function () {
        Route::get('/', 'getSubjectByTeacherId');
        Route::get('/detail-subject', 'getDetailDocumentBySubjectId');
        Route::get('/search-subject','getListSubjectSearch');
    });


Route::controller(App\Http\Controllers\Chapter\ChapterController::class)
    ->prefix('chapters')
    ->group(function () {
        Route::post('/', 'create');
        Route::delete('/{chapter}', 'destroy');
        Route::put('/{chapter}', 'update');
    });

Route::controller(App\Http\Controllers\Lecture\LectureController::class)
    ->prefix('lectures')
    ->group(function () {
        Route::post('/', 'create');
        Route::delete('/{lecture}', 'destroy');
        Route::put('/{lecture}', 'update');
    });
