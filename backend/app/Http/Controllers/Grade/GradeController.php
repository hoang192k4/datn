<?php

namespace App\Http\Controllers\Grade;

use App\Enums\GradeWeight;
use App\Exceptions\ModelNotFoundByIdException;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseOffer\CourseOfferGradeRequest;
use App\Http\Requests\Grade\GradeColumnRequest;
use App\Http\Requests\Grade\GradeRequest;
use App\Http\Resources\Grade\GradeResource;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Http\Resources\Student\StudentGradeResource;
use App\Models\CourseOffer;
use App\Models\Grade;
use App\Repositories\CourseOfferGrade\CourseOfferGradeRepositoryInterface;
use App\Services\Calculate\CalculateService;
use App\Services\Grade\GradeServiceInterface;
use App\Services\CourseOfferGrade\CourseOfferGradeServiceInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\JsonResponse;


class GradeController extends BaseController
{
    use Log, ResponseWithJson;

    protected $gradeService;

    public function __construct(
        CourseOfferGradeRepositoryInterface $repository,
        CourseOfferGradeServiceInterface $service,
        GradeServiceInterface $gradeService,
    ) {
        $this->repository = $repository;
        $this->service = $service;
        $this->gradeService = $gradeService;
        // $this->middleware('auth:teacher');
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

    public function createGradeColumn(GradeColumnRequest $request): JsonResponse
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


    public function updateOrCreateGrade(GradeRequest $request, $id)
    {
        try {
            $instance = $this->gradeService->updateOrCreate($request, $id);
            if ($instance)
                return $this->jsonResponseSuccess(new GradeResource($instance));
            return $this->jsonResponseError();
        } catch (ModelNotFoundByIdException $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError($e->getMessage(), 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function create(GradeRequest $request)
    {
        try {
            $instance = $this->gradeService->create($request);
            if ($instance)
                return $this->jsonResponseSuccess(new GradeResource($instance));
            return $this->jsonResponseError();
        } catch (ModelNotFoundByIdException $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError($e->getMessage(), 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
