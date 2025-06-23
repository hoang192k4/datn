<?php

namespace App\Enums\Student;

enum StudentStatus: string
{
    case Active = 'active';
    case Graduated = 'graduated';
    case Suspended = 'suspended';
    case DroppedOut  = 'dropped_out';
    case Pending = 'pending';

    public static function fromVietnamese(self|string $case): string
    {
        $value = $case instanceof self ? $case->value : trim($case);
        return match ($value) {
            'Đang học'      => self::Active->value,
            'Đã tốt nghiệp' => self::Graduated->value,
            'Bị đình chỉ'   => self::Suspended->value,
            'Bỏ học'        => self::DroppedOut->value,
            'Chờ duyệt'     => self::Pending->value,
        };
    }
}
