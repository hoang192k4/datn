<?php

namespace App\Services\Calculate;

use App\Enums\GradeWeight;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;

class CalculateService implements CalculateServiceInterface
{
    protected $summaryGradeRepository;
    protected $studentRepository;
    public function __construct(
        SummaryGradeRepositoryInterface $summaryGradeRepository,
        StudentRepositoryInterface $studentRepository
    ) {
        $this->summaryGradeRepository = $summaryGradeRepository;
        $this->studentRepository = $studentRepository;
    }

    public function calculateAverageExam($student, $courseSectionId)
    {
        $totalWeights = 0;
        $totalScore = 0;
        $grades = $student->grades->where('course_section_id', $courseSectionId);
        foreach ($grades as $grade) {
            $totalScore += $grade->score * $grade->grade_type->weight;
            $totalWeights += $grade->grade_type->weight;
        }
        return $totalScore / $totalWeights ?? 0;
    }

    public function calculateFinalScore() {}

    public function calculateAttendanceScore() {}
}
