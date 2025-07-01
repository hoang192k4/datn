<?php

namespace App\Models;

use App\Enums\Session\SessionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Session extends Model
{
    //
    use HasFactory;

    protected $fillable = ['id', 'study_week', 'study_date', 'start_time', 'end_time', 'status', 'schedule_id'];
    protected function casts(): array
    {
        return [
            'status' => SessionStatus::class
        ];
    }

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }
}
