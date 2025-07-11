<?php

namespace App\Http\Controllers\Grade;

use Exception;
use App\Models\Grade;
use App\Supports\Log;
use App\Enums\GradeWeight;
use App\Models\CourseSection;
use Illuminate\Http\JsonResponse;
use App\Supports\ResponseWithJson;
use App\Exports\StudentGradesExport;
use App\Imports\StudentGradesImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Enums\CourseSection\GradeStatus;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Grade\GradeRequest;
use App\Http\Resources\Grade\GradeResource;
use App\Exports\StudentGradesTemplateExport;
use App\Services\Calculate\CalculateService;
use App\Services\Grade\GradeServiceInterface;
use App\Exceptions\ModelNotFoundByIdException;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Grade\GradeColumnRequest;
use App\Http\Requests\Grade\GradeImportRequest;
use App\Http\Resources\Student\StudentGradeResource;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Http\Requests\CourseSection\CourseSectionGradeRequest;
use App\Http\Requests\Grade\GradeExportRequest;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Services\CourseSectionGrade\CourseSectionGradeServiceInterface;
use App\Repositories\CourseSectionGrade\CourseSectionGradeRepositoryInterface;

class GradeController extends BaseController
{
    use Log, ResponseWithJson;

    protected $gradeService;
    protected $courseSectionRepository;
    protected $gradeRepository;
    public function __construct(
        CourseSectionGradeRepositoryInterface $repository,
        CourseSectionGradeServiceInterface $service,
        GradeServiceInterface $gradeService,
        CourseSectionRepositoryInterface $courseSectionRepository,
        GradeRepositoryInterface $gradeRepository
    ) {
        $this->repository = $repository;
        $this->service = $service;
        $this->gradeService = $gradeService;
        $this->courseSectionRepository = $courseSectionRepository;
        $this->gradeRepository = $gradeRepository;
        $this->middleware('auth:teacher,student')->except('exportGradeTemplate');
        $this->middleware('role:subject_teacher,homeroom_teacher,faculty_admin,deparment_admin')->except(['getGradesByCourseSection', 'exportGradeTemplate']);
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
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Tạo không thành công', 422, $e->errors()['error'] ?? []);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }


    public function updateOrCreateGrade(GradeRequest $request, $id)
    {
        try {
            $instance = $this->gradeRepository->findOrFailById($id);
            $this->checkUpdateGrade($instance->course_section_id);
            $instance = $this->gradeService->updateOrCreate($request, $id);
            if ($instance)
                return $this->jsonResponseSuccess(new GradeResource($instance));
            return $this->jsonResponseError();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Cập nhật không thành công', 422, $e->errors());
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
            $this->checkUpdateGrade($request->course_section_id);
            $response = $this->service->deleteGradeColumn($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Xóa không thành công', 422, $e->errors());
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

    protected function checkUpdateGrade($courseSectionId)
    {
        $courseSection = $this->courseSectionRepository->findOrFailById($courseSectionId);
        if ($courseSection->grade_status !== GradeStatus::DraftExam) {
            throw ValidationException::withMessages(['Không thể cập nhật điểm vì điểm kiểm tra đã được nộp.']);
        }
    }


    public function exportGradeTemplate(GradeExportRequest $request)
    {
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $selectedColumns = $data['selected_columns'] ?? [];


            $fileName = $this->gradeService->getFileNameExportGradeTemplate($courseSectionId);
            return Excel::download(new StudentGradesTemplateExport($courseSectionId, $selectedColumns), $fileName);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
