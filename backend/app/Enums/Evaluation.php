<?php

namespace App\Enums;

enum Evaluation: string
{
    //
    case Excellent = 'excellent';
    case Good = 'good';
    case Fair = 'fair';
    case Poor = 'poor';
    case Average = 'average';
    case VeryPoor = 'very_poor';


    public static function fromVietnamese(string $label): ?self
    {
        return match (trim($label)) {
            'Xuất sắc' => self::Excellent,
            'Giỏi' => self::Good,
            'Khá' => self::Fair,
            'Trung bình' => self::Average,
            'Yếu' => self::Poor,
            'Kém' => self::VeryPoor,
            default => null,
        };
    }

    public static function getDescription(self|string $case): string
    {
        $value = $case instanceof self ? $case->value : $case;

        return match ($value) {
            self::Excellent->value  => 'Xuất sắc',
            self::Good->value       => 'Giỏi',
            self::Fair->value       => 'Khá',
            self::Average->value    => 'Trung bình',
            self::Poor->value       => 'Yếu',
            self::VeryPoor->value   => 'Kém'
        };
    }
}
