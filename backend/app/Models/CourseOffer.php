<?php

namespace App\Models;

use App\Enums\CourseOffer\CourseOfferStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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

    public function students():BelongsToMany
    {
        return $this->belongsToMany(Student::class,'course_offer_student');
    }
}
