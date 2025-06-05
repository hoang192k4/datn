<?php

namespace App\Models;

use App\Enums\CourseOffer\CourseOfferStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CourseOffer extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => CourseOfferStatus::class,
        ];
    }
}
