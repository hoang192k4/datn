<?php

namespace App\Services\CourseSection;

use Illuminate\Http\Request;

interface CourseSectionServiceInterface
{
    public function getCourseSectionByTeacher(Request $request);
    public function detachStudentByCourseSection(Request $request);
    public function attachStudentByCourseSection(Request $request);
    public function create(Request $request);
    public function update(Request $request,$courseSectionId);
    public function updateStatus(Request $request, $courseSectionId);
}
