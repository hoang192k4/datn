<?php

namespace App\Services\SummaryGrade;


interface SummaryGradeServiceInterface
{
    public function updateSummaryGrade($studentId, $courseSectionId);
    public function updateSummaryGrades($courseSectionId);
}
