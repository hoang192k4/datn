<?php

namespace App\Enums\CourseSection;

enum GradeStatus: string
{
    case DraftExam = 'draft_exam';
    case SubmittedExam = 'submitted_exam';
    case SubmittedExam1 = 'submitted_exam1';
    case SubmittedExam2 = 'submitted_exam2';


    public static function getDescription(self $case): string
    {
        return match ($case) {
            self::DraftExam => 'Đang nhập điểm kiểm tra',
            self::SubmittedExam => 'Đã nộp điểm kiểm tra',
            self::SubmittedExam1 => 'Đã nộp điểm thi lần 1',
            self::SubmittedExam2 => 'Đã nộp toàn bộ điểm',
        };
    }
}
