<?php

namespace App\Services\CourseSection;

use Illuminate\Http\Request;

interface CourseSectionServiceInterface
{
    public function getCourseSectionByTeacher(Request $request);
    public function detachStudentByCourseSection(Request $request);
    public function attachStudentByCourseSection(Request $request);
}
