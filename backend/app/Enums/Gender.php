<?php

namespace App\Enums;

enum Gender: string
{
    case Male = 'male';
    case Female = 'female';


    public static function fromVietnamese(string $label): ?self
    {
        return match (trim($label)) {
            'Nam' => self::Male,
            'Nữ' => self::Female,
            default => null,
        };
    }

    public static function getDescription(self $gender): string
    {
        return match ($gender) {
            self::Male => 'Nam',
            self::Female => 'Nữ',
        };
    }
}
