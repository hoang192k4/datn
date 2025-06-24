<?php

namespace App\Services\Calculate;

use App\Enums\GradeWeight;
use App\Models\Student;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Supports\Log;
use Exception;

class CalculateService implements CalculateServiceInterface
{
    use Log;
    protected $summaryGradeRepository;
    protected $attendanceRepository;
    protected $studentRepository;
    public function __construct(
        SummaryGradeRepositoryInterface $summaryGradeRepository,
        StudentRepositoryInterface $studentRepository,
        CourseSectionAttendanceRepositoryInterface $attendanceRepository,
    ) {
        $this->summaryGradeRepository = $summaryGradeRepository;
        $this->studentRepository = $studentRepository;
        $this->attendanceRepository = $attendanceRepository;
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

        if ($totalWeights === 0)
            return 0;
        return $totalScore / $totalWeights;
    }

    public function calculateFinalScore($summaryGrade)
    {
        $attendanceScore = $summaryGrade->attendance_score ?? 0;
        $avgScore = $summaryGrade->avg_score ?? 0;
        $examScore = $summaryGrade->exam2_score == 0 ? $summaryGrade->exam1_score : $summaryGrade->exam2_score;
        $finalScore = $attendanceScore * 0.1 + $avgScore * 0.4 + $examScore * 0.5;
        return $finalScore ?? 0;
    }

    public function calculateAttendanceScore($studentId, $courseSectionId): int
    {
        $totalAttendanceByCourseSection = $this->attendanceRepository->totalAttendanceStudentByCourseSection($studentId, $courseSectionId);
        $totalSessionByCourseSection = $this->attendanceRepository->totalSessionByCourseSection($courseSectionId);
        $attendanceScore = 10 - ($totalSessionByCourseSection - $totalAttendanceByCourseSection);
        return $attendanceScore;
    }
}
