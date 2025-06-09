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

    public function storeAttendanceStudents($sessionId, $attendanceStudents)
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

    public function getAllAttendanceByCourseOffer(string $courseOfferId)
    {
        return CourseOffer::with([
            'schedules.sessions.attendances.student'
        ])->find($courseOfferId);
    }
}
