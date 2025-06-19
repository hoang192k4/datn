<?php

namespace App\Repositories\CourseSectionAttendance;

use App\Models\Attendance;
use App\Models\CourseSection;
use Illuminate\Http\Request;
use App\Repositories\EloquentRepository;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;

class CourseSectionAttendanceRepository extends EloquentRepository implements CourseSectionAttendanceRepositoryInterface
{
    public function getModel()
    {
        return CourseSection::class;
    }

    public function storeAndUpdateAttendanceStudents($sessionId, $attendanceStudents)
    {
        $result = [];
        foreach ($attendanceStudents as $attendanceStudent) {
            Attendance::updateOrCreate(
                [
                    'session_id' => $sessionId,
                    'student_id' => $attendanceStudent['student_id'],
                ],
                [
                    'status' => $attendanceStudent['status'] ?? 'absent',
                    'note' => $attendanceStudent['note'] ?? null
                ]
            );
            $result[] = $attendanceStudent;
        }

        return $result;
    }

    public function getAllAttendanceByCourseSection(string $courseSectionId)
    {
        return CourseSection::with([
            'schedules.sessions.attendances.student'
        ])->find($courseSectionId);
    }

}
