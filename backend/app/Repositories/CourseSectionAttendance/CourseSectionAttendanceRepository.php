<?php

namespace App\Repositories\CourseSectionAttendance;

use App\Enums\Attendance\AttendanceStatus;
use App\Enums\Session\SessionStatus;
use App\Models\Attendance;
use App\Models\CourseSection;
use App\Models\Session;
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

    public function getAllAttendanceByCourseSection($courseSectionId)
    {
        return CourseSection::with([
            'schedules.sessions.attendances.student'
        ])->find($courseSectionId);
    }

    public function totalAttendanceStudentByCourseSection($studentId, $courseSectionId)
    {
        return  Attendance::whereHas('session.schedule.course_section', function ($query) use ($courseSectionId) {
            $query->where('id', $courseSectionId);
        })->where('student_id', $studentId)->where('status', AttendanceStatus::Present)->count();
    }

    public function totalSessionByCourseSection($courseSectionId)
    {
        return  Session::whereHas('schedule.course_section', function ($query) use ($courseSectionId) {
            $query->where('id', $courseSectionId);
        })->where('status', SessionStatus::Approve)->count();
    }
}
