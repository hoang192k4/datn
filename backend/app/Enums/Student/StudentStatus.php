<?php

namespace App\Enums\Student;

enum StudentStatus: string
{
    case Active = 'active';
    case Graduated = 'graduated';
    case Suspended = 'suspended';
    case DroppedOut  = 'dropped_out';
    case Pending = 'pending';
    case Deferment = 'deferment';

    public static function fromVietnamese(string $case): string|null
    {

        return match (trim($case)) {
            'Đang học'      => self::Active->value,
            'Đã tốt nghiệp' => self::Graduated->value,
            'Bị đình chỉ'   => self::Suspended->value,
            'Thôi học'        => self::DroppedOut->value,
            'Chờ duyệt'     => self::Pending->value,
            'Bảo lưu' => self::Deferment->value,
            default => null,
        };
    }

    public static function getDesciption(self|string $status): string
    {
        if (is_string($status)) {
            $status = self::tryFrom($status); // convert string về enum
        }
        return match ($status) {
            self::Active => 'Đang học',
            self::DroppedOut => 'Thôi học',
            self::Suspended => 'Bị đình chỉ',
            self::Pending => 'Chờ duyệt',
            self::Graduated => 'Đã tốt nghiệp',
            self::Deferment => 'Bảo lưu',
        };
    }

    public static function getDesciptionStatus(self|string $status): string
    {
        if (is_string($status)) {
            $status = self::tryFrom($status); // convert string về enum
        }
        return match ($status) {
            self::Active => 'đang học',
            self::DroppedOut => 'đã thôi học',
            self::Suspended => 'đã bị đình chỉ',
            self::Pending => 'đang chờ duyệt',
            self::Graduated => 'đã tốt nghiệp',
            self::Deferment => 'đã bảo lưu',
        };
    }
}
