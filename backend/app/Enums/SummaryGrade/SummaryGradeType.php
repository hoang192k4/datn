<?php

namespace App\Enums\SummaryGrade;

enum SummaryGradeType: string
{
    //
    case Exam1 = 'exam1_score';
    case Exam2 = 'exam2_score';
    case Attendance = 'attendance_score';
}
