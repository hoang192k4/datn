<?php

namespace App\Services\SummaryGrade;

use App\Models\SummaryGrade;
use Illuminate\Http\Request;


interface SummaryGradeServiceInterface
{
    public function updateSummaryGrade($studentId, $courseSectionId);
    public function updateSummaryGrades($courseSectionId);
    public function update(Request $request, $id): object|bool;
    public function updateAttendanceSore($courseSectionId, $studentId, $attendanceScore): object|bool;
    public function getSummaryGradesByStudent($studentId);
    public function updateNote($courseSectionId, $studentId): object|bool;
    public function updateNoteInCourseSection($courseSectionId): bool;
}
