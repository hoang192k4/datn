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
        Route::get('/', 'getGradesByCourseSection'); //api lấy danh sách sinh viên và điểm
        Route::post('/grade-column', 'createGradeColumn'); //api tạo cột điểm mới (tạo nhiều điểm cùng loại và số lần)
        Route::post('/', 'create'); // api tạo điểm mới
        Route::put('/{id}', 'updateOrCreateGrade'); //api cập nhật điểm
        Route::delete('/', 'deleteGradeColumn'); //api xóa cột điểm (xóa tất cả điểm trong cột)
        Route::get('/export', 'export');
        Route::post('/import', 'import');
    });

Route::controller(App\Http\Controllers\SummaryGrade\SummaryGradeController::class)
    ->prefix('summary-grades')
    ->group(function () {
        Route::put('/{id}', 'update'); //api cập nhật điểm trong summary (cập nhật c.cần, điểm thi)
    });


Route::controller(App\Http\Controllers\Attendance\AttendanceController::class)
    ->prefix('course-section-attendances')
    ->group(function () {
        Route::post('/', 'storeAttendanceStudents');    //api thêm mới điểm danh cho sinh viên
        Route::get('/{courseSectionId}/attendances', 'getAllAttendanceByCourseSection'); //api lấy danh sách sinh viên đã điểm danh theo lớp
        Route::get('/sessions', 'getSessionsByCourseSection'); //api lấy danh sách buổi học của lớp đó
        Route::get('/attendances-session', 'getAttendancesBySession'); //api lấy danh sách điểm danh của lớp học theo buổi đó
        Route::get('/export-template/{session_id}', 'exportTemplateAttendance'); //api xuất danh sách điểm danh theo buổi
        Route::post('/import-attendances', 'importAttendances'); //api nhập danh sách điểm danh

    });


Route::controller(App\Http\Controllers\DeviceToken\DeviceTokenController::class)
    ->prefix('device-token')
    ->group(function () {
        Route::post('/', 'update'); //api cập nhật device-token khi người dùng truy cập hệ thống
    });



Route::controller(App\Http\Controllers\Notification\NotificationController::class)
    ->prefix('notifications')
    ->group(function () {
        Route::post('/', 'sendNotifications'); //api gửi thông báo
        Route::post('/send-to-course-section', 'sendNotificationToCourseSection'); //api gửi thông báo đến lớp
        Route::get('/', 'getMyNotifications'); //api lấy danh sách thông báo theo người dùng đăng nhập
        Route::delete('/{id}', 'destroy'); //api xóa thông báo
        Route::put('/{id}', 'update');
    });

Route::controller(App\Http\Controllers\Notification\StudentNotificationController::class)
    ->prefix('feedbacks')
    ->group(function () {
        Route::post('/', 'sendFeedbackToTeacher'); //api gửi fb của sinh viên
    });

Route::prefix('me')->group(function () {
    Route::controller(App\Http\Controllers\Student\MyStudentController::class)
        ->group(function () {
            Route::get('/students', 'getMyStudents'); //api lấy danh sách sinh viên mà giáo viên đang dạy (có limit)
        });

    Route::controller(App\Http\Controllers\Post\MyPostController::class)
        ->group(function () {
            Route::get('/posts', 'getPostByTeacherId'); //api lấy danh sách bài viết của giáo viên
        });

    Route::controller(App\Http\Controllers\Notification\TeacherNotificationController::class)
        ->group(function () {
            Route::get('/students/notifications', 'getNotificationSendStudentByTeacher');
        });
});

Route::controller(App\Http\Controllers\Post\PostController::class)
    ->prefix('posts')
    ->group(function () {
        Route::delete('/{id}', 'destroy');
        Route::put('/{id}', 'update');
    });
Route::controller(App\Http\Controllers\Auth\AuthController::class)
    ->prefix('auth')
    ->group(function () {
        Route::get('/me', 'me'); //api lấy thông tin cá nhân
        Route::post('/refresh', 'refresh'); //api lấy access và refresh token mới
    });


Route::controller(App\Http\Controllers\CourseSection\CourseSectionController::class)
    ->prefix('course-sections')
    ->group(function () {
        Route::get('/', 'getCourseSectionByTeacher'); //api lấy dánh sách lớp học phần theo teacher đăng nhập
        Route::get('/{courseSectionId}/students', 'getStudentsByCourseSection'); //api lấy danh sách sinh viên của lớp
        Route::delete('/detach-student','detachStudentByCourseSection');
        Route::post('/attach-student','attachStudentByCourseSection');
    });

Route::controller(App\Http\Controllers\GradeType\GradeTypeController::class)
    ->prefix('grade-types')
    ->group(function () {
        Route::get('/', 'index'); //api lấy danh sách loại điểm
    });


Route::controller(App\Http\Controllers\Subject\SubjectController::class)
    ->prefix('subjects')
    ->group(function () {
        Route::get('/', 'getSubjectByTeacherId'); //api lấy danh sách môn học theo giảng viên
        Route::get('/detail-subject', 'getDetailDocumentBySubjectId'); //api lấy thông tin chi tiết của môn học
        Route::get('/search-subject', 'getListSubjectSearch'); //api lấy danh sách môn học theo giảng viên
    });


Route::controller(App\Http\Controllers\Chapter\ChapterController::class)
    ->prefix('chapters')
    ->group(function () {
        Route::post('/', 'create'); //api thêm mới chương
        Route::delete('/{chapter}', 'destroy'); //api xóa chương
        Route::put('/{chapter}', 'update'); //api cập nhật chương
    });

Route::controller(App\Http\Controllers\Lecture\LectureController::class)
    ->prefix('lectures')
    ->group(function () {
        Route::post('/', 'create'); //api thêm mới bài giảng theo chương
        Route::delete('/{lecture}', 'destroy'); //api xóa bài giảng
        Route::put('/{lecture}', 'update'); //api cập nhật bài giảng
    });



Route::controller(App\Http\Controllers\Student\StudentController::class)
    ->prefix('students')
    ->group(function () {
        Route::post('/', 'create'); //api thêm mới sinh viên
        Route::post('/import', 'importStudentsExcel');
        Route::get('/', 'getAllStudents');
    });
