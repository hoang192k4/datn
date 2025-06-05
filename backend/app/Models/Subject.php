<?php

namespace App\Models;

use App\Enums\Enums\Subject\SubjectStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Subject extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => SubjectStatus::class,
        ];
    }
}
