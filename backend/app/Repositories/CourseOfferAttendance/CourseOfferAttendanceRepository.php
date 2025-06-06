<?php

namespace App\Repositories\CourseOfferAttendance;

use App\Models\Attendance;
use App\Models\CourseOffer;
use Illuminate\Http\Request;
use App\Repositories\EloquentRepository;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;

class CourseOfferAttendanceRepository extends EloquentRepository implements CourseOfferAttendanceRepositoryInterface
{
    public function getModel()
    {
        return CourseOffer::class;
    }

    public function storeAttendanceStudents($session_id, $attendanceStudents)
    {
        $result = [];
        foreach ($attendanceStudents as $attendanceStudent) {
            Attendance::updateOrCreate(
                [
                    'session_id' => $session_id,
                    'student_id' => $attendanceStudent['studentId'],
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

    public function getAllAttendanceByCourseOffer(string $courseOfferId)
    {
        return CourseOffer::with([
            'schedules.sessions.attendances.student'
        ])->find($courseOfferId);
    }
}
