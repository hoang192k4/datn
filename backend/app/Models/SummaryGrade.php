<?php

namespace App\Models;

use App\Enums\PublicStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class SummaryGrade extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => PublicStatus::class,
        ];
    }
}
