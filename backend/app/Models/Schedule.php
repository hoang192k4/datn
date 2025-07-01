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

    protected $fillable =  ['id', 'course_section_id', 'period_start', 'period_end', 'period_number', 'session', 'day_of_week', 'classroom_id'];

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

    public function course_section(): BelongsTo
    {
        return $this->belongsTo(CourseSection::class);
    }

    public function classroom(): BelongsTo
    {
        return $this->belongsTo(ClassRoom::class);
    }
}
