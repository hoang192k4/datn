<?php

namespace App\Services\SummaryGrade;

use App\Enums\Evaluation;
use App\Enums\SummaryGrade\SummaryGradeType;
use App\Enums\SummaryGrade\SummayryGradeEvaluation;
use Exception;
use App\Exceptions\ModelNotFoundByIdException;
use App\Models\SummaryGrade;
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

    public function __construct(
        StudentRepositoryInterface $studentRepository,
        CalculateServiceInterface $calculateService,
        SummaryGradeRepositoryInterface $summaryGradeRepository
    ) {
        $this->studentRepository = $studentRepository;
        $this->calculateService = $calculateService;
        $this->summaryGradeRepository = $summaryGradeRepository;
    }

    public function updateSummaryGrade($studentId, $courseSectionId)
    {
        try {
            $student = $this->studentRepository->findOrFailById($studentId);
            $avgScore = $this->calculateService->calculateAverageExam($student, $courseSectionId);
            $summaryGrade = $this->summaryGradeRepository->updateOrCreate(['student_id' => $student->id, 'course_section_id' => $courseSectionId], ['avg_score' => $avgScore]);
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

    public function updateSummaryGrades($courseSectionId)
    {
        try {
            $students = $this->studentRepository->getStudentsAndGradesBycourseSectionId($courseSectionId);
            foreach ($students as $student) {
                $this->updateSummaryGrade($student->id, $courseSectionId);
            }
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function update(Request $request, SummaryGrade $instance): object|bool
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
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
        if ($finalScore < 5 && $exam1Score && is_null($exam2Score))
            return SummayryGradeEvaluation::RETEST;
        if ($finalScore < 5 && $exam2Score)
            return SummayryGradeEvaluation::LEARNAGAIN;
        return SummayryGradeEvaluation::PASS;
    }
}
