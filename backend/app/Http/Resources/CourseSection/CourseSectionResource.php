<?php

namespace App\Http\Resources\CourseSection;

use App\Enums\Student\StudentStatus;
use App\Http\Resources\Semester\SemesterResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSectionResource extends JsonResource
{

    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'week_total' => $this->week_total,
            'class' => optional($this->class)->name,
            'class_id' => $this->class_id,
            'subject' => optional($this->subject)->name,
            'subject_id' => $this->subject_id,
            'semester' => new SemesterResource($this->semester),
            'teacher' => optional($this->teacher)->name,
            'teacher_id' => $this->teacher_id,
            'status' => $this->status,
            'created_at' => format_date($this->created_at),
            'students_total' => $this->students()->where('status', StudentStatus::Active)->count(),
        ];
    }
}
