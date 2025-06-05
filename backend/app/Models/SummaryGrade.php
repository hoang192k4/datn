<?php

namespace App\Models;

use App\Enums\PublicStatus;
use App\Enums\Evaluation;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SummaryGrade extends Model
{
    //
    use HasFactory;


    protected function casts(): array
    {
        return [
            'avaluation' => Evaluation::class,
            'status' => PublicStatus::class,
        ];
    }
}
