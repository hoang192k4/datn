<?php

namespace App\Services\SummaryGrade;

use App\Enums\Evaluation;
use App\Enums\Student\StudentStatus;
use App\Enums\SummaryGrade\SummaryGradeType;
use App\Enums\SummaryGrade\SummayryGradeEvaluation;
use Exception;
use App\Exceptions\ModelNotFoundByIdException;
use App\Models\SummaryGrade;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Services\Calculate\CalculateServiceInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use App\Supports\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SummaryGradeService implements SummaryGradeServiceInterface
{

    use Log;
    protected $studentRepository;
    protected $calculateService;
    protected $summaryGradeRepository;
    protected $courseSectionRepository;

    public function __construct(
        StudentRepositoryInterface $studentRepository,
        CalculateServiceInterface $calculateService,
        SummaryGradeRepositoryInterface $summaryGradeRepository,
        CourseSectionRepositoryInterface $courseSectionRepository,
    ) {
        $this->studentRepository = $studentRepository;
        $this->calculateService = $calculateService;
        $this->summaryGradeRepository = $summaryGradeRepository;
        $this->courseSectionRepository = $courseSectionRepository;
    }

    //cập nhật điểm trung bình kiểm tra, điểm tổng kết, đánh giá
    public function updateSummaryGrade($studentId, $courseSectionId)
    {
        $student = $this->studentRepository->findOrFailById($studentId);
        //tính điểm trung bình kiểm tra
        $avgScore = $this->calculateService->calculateAverageExam($student, $courseSectionId);
        $summaryGrade = $this->summaryGradeRepository->updateOrCreate(['student_id' => $student->id, 'course_section_id' => $courseSectionId], ['avg_score' => $avgScore]);
        $finalScore = $this->calculateService->calculateFinalScore($summaryGrade);
        $summaryGrade->final_score = $finalScore;
        $summaryGrade->evaluation = $this->getEvaluation($finalScore);
        $summaryGrade->save();
        return true;
    }

    public function updateSummaryGrades($courseSectionId)
    {
        try {
            $courseSection = $this->courseSectionRepository->findOrFailById($courseSectionId);
            $students = $courseSection->students->where('status', StudentStatus::Active);
            foreach ($students as $student) {
                $this->updateSummaryGrade($student->id, $courseSectionId);
            }
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    //cập nhật điểm thi, chuyên cần
    public function update(Request $request,  $id): object|bool
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $instance = $this->summaryGradeRepository->findOrFailById($id);
            switch ($data['score_type']) {
                case SummaryGradeType::Exam1->value:
                    $instance->exam1_score = $data['score'];
                    break;
                case SummaryGradeType::Exam2->value:
                    $instance->exam2_score = $data['score'];
                    break;
                case SummaryGradeType::Attendance->value:
                    $instance->attendance_score = $data['score'];
                    break;
                default:
                    return false;
            }
            $finalScore = $this->calculateService->calculateFinalScore($instance);
            $instance->final_score = $finalScore;
            $instance->evaluation = $this->getEvaluation($finalScore);
            $instance->note = $this->evaluateAcademicResult($finalScore, $instance->exam1_score, $instance->exam2_score);
            $instance->save();
            DB::commit();
            return $instance ?? false;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            DB::rollBack();
            return false;
        }
    }

    public function updateAttendanceSore($courseSectionId, $studentId, $attendanceScore): object|bool
    {
        try {
            $student = $this->studentRepository->findOrFailById($studentId);
            $summaryGrade = $this->summaryGradeRepository->firstOrCreate(['student_id' => $student->id, 'course_section_id' => $courseSectionId]);
            $summaryGrade->attendance_score = $attendanceScore;
            $finalScore = $this->calculateService->calculateFinalScore($summaryGrade);
            $summaryGrade->final_score = $finalScore;
            $summaryGrade->evaluation = $this->getEvaluation($finalScore);
            $summaryGrade->save();
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    protected function getEvaluation($score)
    {
        if ($score <= 10 && $score >= 9)
            return Evaluation::Excellent;
        if ($score >= 8)
            return Evaluation::Good;
        if ($score >= 7)
            return Evaluation::Fair;
        if ($score >= 5)
            return Evaluation::Average;
        return Evaluation::Poor;
    }

    protected function evaluateAcademicResult($finalScore, $exam1Score, $exam2Score): string
    {
        if (($finalScore < 5 && $exam1Score && is_null($exam2Score)) || $exam1Score < 1)
            return SummayryGradeEvaluation::RETEST;
        if ($finalScore < 5 && !is_null($exam2Score))
            return SummayryGradeEvaluation::LEARNAGAIN;
        return SummayryGradeEvaluation::PASS;
    }

    public function getSummaryGradesByStudent($studentId)
    {
        $summaryGrades =  $this->summaryGradeRepository->findByStudent($studentId);
        if (!$summaryGrades)
            return false;
        return $summaryGrades;
    }
}
