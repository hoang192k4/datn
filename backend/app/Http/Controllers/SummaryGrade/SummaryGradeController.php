<?php

namespace App\Http\Controllers\SummaryGrade;

use Exception;
use Illuminate\Http\JsonResponse;
use App\Enums\CourseSection\GradeStatus;
use App\Http\Controllers\BaseController;
use App\Http\Resources\Grade\GradeResource;
use App\Enums\SummaryGrade\SummaryGradeType;
use App\Exceptions\ModelNotFoundByIdException;
use Illuminate\Validation\ValidationException;
use App\Http\Resources\Student\StudentGradeResource;
use App\Http\Resources\Grade\GradeResourceCollection;
use App\Http\Requests\SummaryGrade\SummaryGradeRequest;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Http\Resources\SummaryGrade\SemesterSummaryGradeResource;
use App\Models\SummaryGrade;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;


class SummaryGradeController extends BaseController
{
    protected $courseSectionRepository;
    public function __construct(
        SummaryGradeServiceInterface $service,
        SummaryGradeRepositoryInterface $repository,
        CourseSectionRepositoryInterface $courseSectionRepository
    ) {
        $this->service = $service;
        $this->repository = $repository;
        $this->courseSectionRepository = $courseSectionRepository;
        $this->middleware('auth:teacher');
        $this->middleware('role:homeroom_teacher,subject_teacher,faculty_admin,apartment_admin');
    }

    public function update(SummaryGradeRequest $request, $id)
    {
        try {
            $data = $request->validated();
            $instance = $this->repository->findOrFailById($id);
            $scoreType = $data['score_type'] ?? null;

            $this->checkUpdateGrade($instance->course_section_id, $scoreType);

            $response = $this->service->update($request, $id);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Cập nhật không thành công', 422, $e->errors());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getSummaryGradesByStudent($studentId)
    {
        try {
            $summaryGrades = $this->service->getSummaryGradesByStudent($studentId);
            if (!$summaryGrades)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(SemesterSummaryGradeResource::collection($summaryGrades));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    protected function checkUpdateGrade($courseSectionId, $scoreType): bool
    {
        $courseSection = $this->courseSectionRepository->findOrFailById($courseSectionId);

        if (($scoreType == SummaryGradeType::Exam1->value || $scoreType == SummaryGradeType::Exam2->value) && $courseSection->grade_status === GradeStatus::DraftExam) {
            throw ValidationException::withMessages(['Không thể cập nhật điểm thi vì điểm kiểm tra chưa được nộp.']);
        }

        if ($scoreType == SummaryGradeType::Exam1->value && $courseSection->grade_status === GradeStatus::SubmittedExam1) {
            throw ValidationException::withMessages(['Không thể cập nhật điểm thi lần 1 vì điểm thi lần 1 đã được nộp.']);
        }

        if ($scoreType == SummaryGradeType::Exam1->value && $courseSection->grade_status === GradeStatus::SubmittedExam2) {
            throw ValidationException::withMessages(['Không thể cập nhật điểm thi lần 1 vì điểm thi đã được nộp.']);
        }

        if ($scoreType == SummaryGradeType::Exam2->value && $courseSection->grade_status === GradeStatus::SubmittedExam) {
            throw ValidationException::withMessages(['Không thể cập nhật điểm thi lần 2 vì điểm thi lần 1 chưa được nộp.']);
        }

        if ($scoreType == SummaryGradeType::Exam2->value && $courseSection->grade_status === GradeStatus::SubmittedExam2) {
            throw ValidationException::withMessages(['Không thể cập nhật điểm thi lần 2 vì điểm thi lần 2 đã được nộp.']);
        }

        if ($scoreType == SummaryGradeType::Attendance->value && $courseSection->grade_status !== GradeStatus::DraftExam) {
            throw ValidationException::withMessages(['Không thể cập nhật chuyên cần vì điểm chuyên cần và điểm kiểm tra đã được nộp.']);
        }

        return true;
    }
}
