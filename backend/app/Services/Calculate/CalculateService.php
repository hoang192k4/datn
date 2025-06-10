<?php

namespace App\Services\Calculate;

use App\Enums\GradeWeight;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use App\Supports\Log;
use Exception;

class CalculateService implements CalculateServiceInterface
{
    use Log;
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
        $this->logInfo($student);
        $grades = $student->grades->where('course_section_id', $courseSectionId);

        foreach ($grades as $grade) {
            $this->logInfo($grade);
            $totalScore += $grade->score * $grade->grade_type->weight;
            $totalWeights += $grade->grade_type->weight;
        }
        return $totalScore / $totalWeights ?? 0;
    }

    public function calculateFinalScore($summaryGrade)
    {
        $attendanceScore = $summaryGrade->attendance_score ?? 0;
        $avgScore = $summaryGrade->avg_score ?? 0;
        $examScore = $summaryGrade->exam2_score == 0 ? $summaryGrade->exam1_score : $summaryGrade->exam2_score;
        $finalScore = $attendanceScore * 0.1 + $avgScore * 0.4 + $examScore * 0.5;
        return $finalScore ?? 0;
    }

    public function calculateAttendanceScore() {}
}
