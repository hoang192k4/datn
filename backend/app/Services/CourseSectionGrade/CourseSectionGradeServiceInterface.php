<?php

namespace App\Services\CourseSectionGrade;

use Illuminate\Http\Request;

interface CourseSectionGradeServiceInterface
{
    public function getGradesByStudentAndCourseSection(Request $request);
    public function addGradeColumn(Request $request);
}
