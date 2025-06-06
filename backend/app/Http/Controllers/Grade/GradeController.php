<?php

namespace App\Http\Controllers\Grade;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseOffer\CourseOfferGradeRequest;
use App\Http\Requests\Grade\GradeColumnRequest;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Http\Resources\Student\StudentGradeResource;
use App\Models\CourseOffer;
use App\Models\Grade;
use App\Repositories\CourseOfferGrade\CourseOfferGradeRepositoryInterface;
use App\Services\CourseOfferGrade\CourseOfferGradeServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\JsonResponse;


class GradeController extends BaseController
{
    use Log, ResponseWithJson;


    public function __construct(
        CourseOfferGradeRepositoryInterface $repository,
        CourseOfferGradeServiceInterface $service,
    ) {
        $this->repository = $repository;
        $this->service = $service;
    }

    public function getGradesByCourseOffer(CourseOfferGradeRequest $request): JsonResponse
    {
        $gradesWithStudent = $this->service->getGradesByStudentAndCourseOffer($request);
        try {
            return $this->jsonResponseSuccess(StudentGradeResource::collection($gradesWithStudent));
        } catch (Exception $e) {
            $this->logError('Lỗi', $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function createGradeColumn(GradeColumnRequest $request)
    {
        try {
            $response = $this->service->addGradeColumn($request);
            if ($response)
                return $this->jsonResponseSuccess();
            return $this->jsonResponseError('Tạo không thành công');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
