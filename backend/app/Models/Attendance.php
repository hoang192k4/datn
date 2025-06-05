<?php

namespace App\Models;

use App\Enums\Attendance\AttendanceStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    //
    use HasFactory;

    protected function casts():array
    {
        return [
            'status' => AttendanceStatus::class
        ];
    }
}
