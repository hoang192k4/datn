<?php

namespace App\Services\CourseSectionAttendance;

use Illuminate\Http\Request;

interface CourseSectionAttendanceServiceInterface
{
   public function storeAttendanceStudents(Request $request);
   public function getAllAttendanceByCourseSection(string $courseSectionId);
}
