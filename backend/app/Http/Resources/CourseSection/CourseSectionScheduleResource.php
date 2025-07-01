<?php

namespace App\Http\Resources\CourseSection;

use App\Http\Resources\Semester\SemesterResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseSectionScheduleResource extends JsonResource
{

    public function toArray(Request $request)
    {

        return [
            'id' => $this->id,
            'name' => $this->name,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'week_total' => $this->week_total,
            'subject' => optional($this->subject)->name,
            'semester' => new SemesterResource($this->semester),
            'status' => $this->status,
            'teacher' => optional($this->teacher)->name,
            'created_at' => format_date($this->created_at),
        ];
    }
}
