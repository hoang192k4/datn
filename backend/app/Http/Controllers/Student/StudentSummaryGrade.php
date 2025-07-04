<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\SummaryGrade\SemesterSummaryGradeResource;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use App\Traits\AuthStudentApi;
use Exception;
use Illuminate\Http\Request;

class StudentSummaryGrade extends BaseController
{
    use AuthStudentApi;

    protected $summaryGradeRepository;
    public function __construct(SummaryGradeRepositoryInterface $summaryGradeRepository)
    {
        $this->summaryGradeRepository = $summaryGradeRepository;
        $this->middleware('auth:student');
    }
    public function getSummaryGradeMyStudent()
    {
        try {
            $studentId = $this->getCurrentStudentId();
            $summaryGrades = $this->summaryGradeRepository->findByStudent($studentId);
            if (!$summaryGrades)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(SemesterSummaryGradeResource::collection($summaryGrades));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống!', 500);
        }
    }
}
