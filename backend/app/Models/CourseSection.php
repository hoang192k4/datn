<?php

namespace App\Models;

use App\Enums\CourseSection\CourseSectionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CourseSection extends Model
{
    //
    use HasFactory;

    protected $table = 'course_sections';

    protected $fillable = ['id', 'name', 'start_date', 'end_date', 'week_total', 'class_id', 'classroom_id', 'teacher_id', 'subject_id', 'semester_id'];

    protected function casts(): array
    {
        return [
            'status' => CourseSectionStatus::class,
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function class(): BelongsTo
    {
        return $this->belongsTo(ClassStudent::class, 'class_id');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function semester(): BelongsTo
    {
        return $this->belongsTo(Semester::class);
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
