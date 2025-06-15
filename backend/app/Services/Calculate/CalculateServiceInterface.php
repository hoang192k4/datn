<?php

namespace App\Services\Calculate;

use App\Models\Student;

interface CalculateServiceInterface
{
    public function calculateAverageExam($student, $courseSectionId);
    public function calculateFinalScore($summaryGrade);
    public function calculateAttendanceScore(Student $student, $courseSectionId):int;
}
