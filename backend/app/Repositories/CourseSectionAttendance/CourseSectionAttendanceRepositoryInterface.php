<?php

namespace App\Repositories\CourseSectionAttendance;

use Illuminate\Http\Request;
use App\Repositories\EloquentRepositoryInterface;

interface CourseSectionAttendanceRepositoryInterface extends EloquentRepositoryInterface
{
    public function storeAndUpdateAttendanceStudents($session_id, $attendanceStudents);
    public function getAllAttendanceByCourseSection(string $courseSectionId);
    public function totalAttendanceStudentByCourseSection($studentId, $courseSectionId);
    public function totalSessionByCourseSection($courseSectionId);
}
