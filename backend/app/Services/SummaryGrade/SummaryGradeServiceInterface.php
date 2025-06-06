<?php

namespace App\Services\SummaryGrade;


interface SummaryGradeServiceInterface
{
    public function updateSummaryGrade($studentId, $courseOfferId);
    public function updateSummaryGrades($courseOfferId);
}
