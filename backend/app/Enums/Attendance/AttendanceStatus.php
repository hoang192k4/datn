<?php

namespace App\Enums\Attendance;

enum AttendanceStatus: string
{
    //
    case Present = 'present';
    case Absent = 'absent';
    case ExcusedAbsent = 'excused_absent';
    case Late = 'late';
}
