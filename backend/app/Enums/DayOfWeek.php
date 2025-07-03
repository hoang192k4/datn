<?php

namespace App\Enums;

use InvalidArgumentException;

enum DayOfWeek: int
{
    //

    case Monday = 1;
    case Tuesday = 2;
    case Wednesday = 3;
    case Thursday = 4;
    case Friday = 5;
    case Saturday = 6;
    case Sunday = 7;

    public static function getDescription(self|int $case): string
    {
        if (is_int($case)) {
            $case = self::tryFrom($case) ?? throw new InvalidArgumentException("Invalid day of week: $case");
        }
        return match ($case) {
            self::Monday => 'Thứ 2',
            self::Tuesday => 'Thứ 3',
            self::Wednesday => 'Thứ 4',
            self::Thursday => 'Thứ 5',
            self::Friday => 'Thứ 6',
            self::Saturday => 'Thứ 7',
            self::Sunday => 'Chủ nhật',
        };
    }
}
