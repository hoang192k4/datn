<?php

namespace App\Enums\CourseSection;

enum CourseSectionStatus: string
{
    case InRegister = 'in_register';
    case InProgress = 'in_progress';
    case Completed = 'completed';

    public static function getDescription(self $case): string
    {
        return match ($case) {
            self::InRegister => 'đang mở đăng ký',
            self::InProgress => 'đang diễn ra',
            self::Completed => 'đã hoàn thành',
        };
    }
}
