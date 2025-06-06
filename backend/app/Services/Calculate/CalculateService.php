<?php

namespace App\Services\Calculate;

use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;

class CalculateService implements CalculateServiceInterface
{
    protected $summaryGradeRepository;
    public function __construct(
        SummaryGradeRepositoryInterface $summaryGradeRepository
    ) {
        $this->summaryGradeRepository = $summaryGradeRepository;
    }
    public function calculateAverageExam($student, $courseOfferId) {}
}
