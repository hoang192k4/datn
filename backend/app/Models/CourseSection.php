<?php

namespace App\Models;

use App\Enums\CourseSection\CourseSectionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSection extends Model
{
    //
    use HasFactory;

    protected $table = 'course_sections';

    protected function casts(): array
    {
        return [
            'status' => CourseSectionStatus::class,
        ];
    }

    public function students(): BelongsToMany
    {
        return $this->belongsToMany(Student::class, 'course_section_student');
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
