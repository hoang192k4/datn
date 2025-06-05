<?php

namespace App\Enums\Attendance;

enum AttendanceStatus: string
{
    //
    case Present = 'present';
    case Absent = 'absent';
    case ExcuseAbsent = 'excuse_absent';
    case Late = 'late';
}
