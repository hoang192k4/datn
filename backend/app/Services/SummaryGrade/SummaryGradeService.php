<?php

namespace App\Services\SummaryGrade;

use Exception;
use App\Exceptions\ModelNotFoundByIdException;
use App\Services\Calculate\CalculateServiceInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use App\Supports\Log;

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

    public function updateSummaryGrade($studentId, $courseOfferId)
    {
        try {
            $student = $this->studentRepository->findOrFailById($studentId);
            $avgScore = $this->calculateService->calculateAverageExam($student, $courseOfferId);

            $this->summaryGradeRepository->updateOrCreate(['student_id' => $student->id, 'course_offer_id' => $courseOfferId], ['avg_score' => $avgScore]);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function updateSummaryGrades($courseOfferId)
    {
        try {
            $students = $this->studentRepository->getStudentsAndGradesByCourseOfferId($courseOfferId);
            foreach ($students as $student) {
                $this->updateSummaryGrade($student->id, $courseOfferId);
            }
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
