<?php

namespace App\Models;

use App\Enums\DayOfWeek;
use App\Enums\Schedule\SessionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'session' => SessionStatus::class,
            'day_of_week' => DayOfWeek::class
        ];
    }


    public function sessions(): HasMany
    {
        return $this->hasMany(Session::class);
    }

    public function course_section():BelongsTo
    {
        return $this->belongsTo(CourseSection::class);
    }
}
