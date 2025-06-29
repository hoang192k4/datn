<?php

namespace App\Enums\Teacher;

enum TeacherStatus: string
{
    case Active = 'active';
    case Inactive = 'inactive';

    public static function getDescription(self $status): string
    {
        return match ($status) {
            self::Active => 'Hoạt Động',
            self::Inactive => 'Tạm Ngưng',
        };
    }
}
