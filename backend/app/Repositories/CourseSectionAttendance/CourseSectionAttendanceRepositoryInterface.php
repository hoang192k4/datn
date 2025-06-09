<?php

namespace App\Repositories\CourseSectionAttendance;

use Illuminate\Http\Request;
use App\Repositories\EloquentRepositoryInterface;

interface CourseSectionAttendanceRepositoryInterface extends EloquentRepositoryInterface
{
    public function storeAttendanceStudents($session_id, $attendanceStudents);
    public function getAllAttendanceByCourseSection(string $courseSectionId);
}
