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

    protected $fillable = ['id', 'student_id', 'semester_id', 'subject_id', 'attempt', 'attendance_score', 'avg_score', 'exam1_score', 'exam2_score', 'final_score', 'evaluation', 'course_section_id', 'created_at', 'updated_at'];
    protected function casts(): array
    {
        return [
            'avaluation' => Evaluation::class,
            'status' => PublicStatus::class,
        ];
    }
}
