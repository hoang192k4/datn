<?php

namespace App\Models;

use App\Enums\CourseOffer\CourseOfferStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseOffer extends Model
{
    //
    use HasFactory;

    protected $table = 'course_offers';

    protected function casts(): array
    {
        return [
            'status' => CourseOfferStatus::class,
        ];
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'course_offer_student');
    }

    public function summary_grades(): HasMany
    {
        return $this->hasMany(SummaryGrade::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    public function grades(): HasMany
    {
        return $this->hasMany(Grade::class);
    }
}
