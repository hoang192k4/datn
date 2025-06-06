<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\BaseController;
use App\Models\CourseOffer;
use App\Supports\JsonResponse;
use App\Supports\Log;
use Exception;
use Illuminate\Http\JsonResponse as Json;


class GradeController extends BaseController
{
    use Log, JsonResponse;
    public function __construct()
    {
        $this->middleware('auth:teacher');
    }

    public function getGradesByCourseOffer(): Json
    {
        $gradesAndStudents = CourseOffer::with('students')->with('grades');
        try {
            $this->jsonResponseSuccess($gradesAndStudents);
        } catch (Exception $e) {
            $this->logError('Lỗi', $e);
            $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
