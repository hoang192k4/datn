<?php

namespace App\Models;

use App\Enums\Attendance\AttendanceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'student_id',
        'session_id',
        'note',
        'status',
    ];

    protected function casts():array
    {
        return [
            'status' => AttendanceStatus::class
        ];
    }

    public function student():BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function session():BelongsTo
    {
        return $this->belongsTo(Session::class);
    }
}
