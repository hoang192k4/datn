<?php

namespace App\Http\Controllers\Grade;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Models\CourseOffer;
use App\Models\Grade;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\JsonResponse;


class GradeController extends BaseController
{
    use Log, ResponseWithJson;
    public function __construct()
    {
        $this->middleware('auth:teacher');
    }

    public function getGradesByCourseOffer($courseOfferId): JsonResponse
    {
        $courseOffer = CourseOffer::find($courseOfferId);
        $gradesAndStudents = $courseOffer->grades;
        try {
            return $this->jsonResponseSuccess(new GradeResourceCollection($gradesAndStudents));
        } catch (Exception $e) {
            $this->logError('Lỗi', $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
