<?php

namespace App\Services\CourseSection;

use Illuminate\Http\Request;

interface CourseSectionServiceInterface
{
    public function getCourseSectionByTeacher(Request $request);
}
