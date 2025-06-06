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

    protected $fillable = ['id', 'score', 'course_offer_id', 'score_visibility', 'grade_type_id'];

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

    public function courseOffer(): BelongsTo
    {
        return $this->belongsTo(CourseOffer::class);
    }

    public function gradeType(): BelongsTo
    {
        return $this->belongsTo(GradeType::class);
    }
}
