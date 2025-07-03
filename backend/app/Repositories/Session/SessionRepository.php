<?php

namespace App\Repositories\Session;

use App\Enums\Schedule\SessionStatus;
use App\Enums\Session\SessionStatus as SessionSessionStatus;
use App\Models\Session;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;

class SessionRepository extends EloquentRepository implements SessionRepositoryInterface
{
    protected $table = 'sessions';
    public function getModel()
    {
        return Session::class;
    }

    public function getSchedulesByTeacher($teacherId, $startOfWeek, $endOfWeek)
    {
        return DB::table($this->table)
            ->join('schedules', 'sessions.schedule_id', '=', 'schedules.id')
            ->join('course_sections', 'schedules.course_section_id', '=', 'course_sections.id')
            ->join('classrooms', 'schedules.classroom_id', '=', 'classrooms.id')
            ->where('course_sections.teacher_id', $teacherId)
            ->where('sessions.status', SessionSessionStatus::Approve)
            ->whereBetween('sessions.study_date', [$startOfWeek, $endOfWeek])
            ->select('sessions.study_date', 'sessions.start_time', 'sessions.end_time', 'course_sections.name as course_section_name', 'schedules.session', 'classrooms.name as classroom_name', 'schedules.day_of_week')
            ->orderBy('sessions.study_date')
            ->orderBy('start_time')
            ->get();
    }

    public function getSchedulesByStudent($studentId, $startOfWeek, $endOfWeek)
    {
        return DB::table($this->table)
            ->join('schedules', 'sessions.schedule_id', '=', 'schedules.id')
            ->join('course_sections', 'schedules.course_section_id', '=', 'course_sections.id')
            ->join('course_section_student', 'course_sections.id', '=','course_section_student.course_section_id')
            ->join('classrooms', 'schedules.classroom_id', '=', 'classrooms.id')
            ->where('course_section_student.student_id', $studentId)
            ->where('sessions.status', SessionSessionStatus::Approve)
            ->whereBetween('sessions.study_date', [$startOfWeek, $endOfWeek])
            ->select('sessions.study_date', 'sessions.start_time', 'sessions.end_time', 'course_sections.name as course_section_name', 'schedules.session', 'classrooms.name as classroom_name', 'schedules.day_of_week')
            ->orderBy('sessions.study_date')
            ->orderBy('start_time')
            ->get();
    }
}
