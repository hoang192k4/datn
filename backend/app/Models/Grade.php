<?php

namespace App\Models;

use App\Enums\Grade\GradeScoreVisibility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Grade extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'score_visibility' => GradeScoreVisibility::class,
        ];
    }
}
