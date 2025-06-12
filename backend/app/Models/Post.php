<?php

namespace App\Models;

use App\Enums\PublicStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Post extends Model
{
    //
    protected $fillable = ['id', 'title', 'content', 'teacher_id', 'course_section_id', 'status'];
    protected $casts = [
        'status' => PublicStatus::class
    ];

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function course_section(): BelongsTo
    {
        return $this->belongsTo(CourseSection::class);
    }
}
