<?php

namespace App\Models;

use App\Enums\Grade\GradeScoreVisibility;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Grade extends Model
{
    //
    use HasFactory;

    protected $fillable = ['score', 'course_section_id', 'score_visibility', 'grade_type_id', 'student_id', 'attempt'];

    protected function casts(): array
    {
        return [
            'score_visibility' => GradeScoreVisibility::class,
        ];
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function course_section(): BelongsTo
    {
        return $this->belongsTso(CourseSection::class);
    }

    public function grade_type(): BelongsTo
    {
        return $this->belongsTo(GradeType::class);
    }
}
