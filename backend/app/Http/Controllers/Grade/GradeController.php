<?php

namespace App\Http\Controllers\Auth;


use App\Http\Controllers\BaseController;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Models\CourseOffer;
use App\Models\Grade;
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

    public function getGradesByCourseOffer($courseOfferId): Json
    {
        $courseOffer = CourseOffer::find($courseOfferId);
        $gradesAndStudents = $courseOffer->grades;
        try {
            return $this->jsonResponseSuccess(new GradeResourceCollection($gradesAndStudents));
        } catch (Exception $e) {
            $this->logError('Lỗi', $e);
            $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
