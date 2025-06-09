<?php

namespace App\Services\Calculate;

interface CalculateServiceInterface
{
    public function calculateAverageExam($student, $courseSectionId);
}
