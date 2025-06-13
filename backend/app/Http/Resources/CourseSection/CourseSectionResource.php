<?php

namespace App\Http\Resources\CourseSection;

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
            'end_start' => $this->end_start,
            'week_total' => $this->week_total,
            'class' => optional($this->class)->name,
            'classroom' => optional($this->classroom)->name,
            'subject' => optional($this->subject)->name,
            'semester' => optional($this->semester)->name,
            'status' => $this->status,
            'created_at' => format_date($this->created_at)
        ];
    }
}
