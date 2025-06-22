<?php

namespace App\Services\CourseSectionAttendance;

use Illuminate\Http\Request;

interface CourseSectionAttendanceServiceInterface
{
   public function storeAttendanceStudents(Request $request);
   public function getAllAttendanceByCourseSection(string $courseSectionId);
   public function getSessionsByCourseSection(Request $request);
   public function getAttendancesBySession(Request $request);
   public function attendanceScore($studentId, $courseSectionId);
}
