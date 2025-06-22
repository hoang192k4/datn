<?php

namespace App\Http\Controllers\SummaryGrade;

use App\Exceptions\ModelNotFoundByIdException;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseSectionGradeRequest;
use App\Http\Requests\Grade\GradeColumnRequest;
use App\Http\Requests\Grade\GradeRequest;
use App\Http\Requests\SummaryGrade\SummaryGradeRequest;
use App\Http\Resources\Grade\GradeResource;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Http\Resources\Student\StudentGradeResource;
use App\Models\CourseSection;
use App\Models\Grade;
use App\Models\SummaryGrade;
use App\Repositories\CourseSectionGrade\CourseSectionGradeRepositoryInterface;
use App\Services\Calculate\CalculateService;
use App\Services\Grade\GradeServiceInterface;
use App\Services\CourseSectionGrade\CourseSectionGradeServiceInterface;
use App\Services\SummaryGrade\SummaryGradeService;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\JsonResponse;


class SummaryGradeController extends BaseController
{

    public function __construct(
        SummaryGradeServiceInterface $service
    ) {
        $this->service = $service;
        $this->middleware('auth:teacher');
        $this->middleware('role:homeroom_teacher,subject_teacher,faculty_admin,apartment_admin');
    }

    public function update(SummaryGradeRequest $request, $id)
    {
        try {
            $response = $this->service->update($request, $id);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
