<?php

namespace App\Models;

use App\Enums\DayOfWeek;
use App\Enums\Schedule\Session;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Schedule extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'session' => Session::class,
            'day_of_week' => DayOfWeek::class
        ];
    }
}
