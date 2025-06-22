<?php

namespace App\Http\Controllers\Grade;

use App\Enums\GradeWeight;
use App\Exceptions\ModelNotFoundByIdException;
use App\Exports\StudentGradesExport;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseSectionGradeRequest;
use App\Http\Requests\Grade\GradeColumnRequest;
use App\Http\Requests\Grade\GradeImportRequest;
use App\Http\Requests\Grade\GradeRequest;
use App\Http\Resources\Grade\GradeResource;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Http\Resources\Student\StudentGradeResource;
use App\Imports\StudentGradesImport;
use App\Models\CourseSection;
use App\Models\Grade;
use App\Repositories\CourseSectionGrade\CourseSectionGradeRepositoryInterface;
use App\Services\Calculate\CalculateService;
use App\Services\Grade\GradeServiceInterface;
use App\Services\CourseSectionGrade\CourseSectionGradeServiceInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class GradeController extends BaseController
{
    use Log, ResponseWithJson;

    protected $gradeService;

    public function __construct(
        CourseSectionGradeRepositoryInterface $repository,
        CourseSectionGradeServiceInterface $service,
        GradeServiceInterface $gradeService,
    ) {
        $this->repository = $repository;
        $this->service = $service;
        $this->gradeService = $gradeService;
        $this->middleware('auth:teacher');
        $this->middleware('role:subject_teacher,homeroom_teacher')->except(['getGradesByCourseSection']);
    }

    public function getGradesByCourseSection(CourseSectionGradeRequest $request): JsonResponse
    {
        $gradesWithStudent = $this->service->getGradesByStudentAndCourseSection($request);
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

    public function deleteGradeColumn(GradeColumnRequest $request)
    {
        try {
            $response = $this->service->deleteGradeColumn($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function export(GradeRequest $request)
    {
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $fileName = $this->gradeService->getFileNameExportGrade($courseSectionId);
            return Excel::download(new StudentGradesExport($courseSectionId), $fileName);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function import(GradeImportRequest $request)
    {
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            Excel::import(new StudentGradesImport($courseSectionId), $request->file('file'));
            return $this->jsonResponseSuccessNoData();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Import thất bại', 422, $e->errors()['import']);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
