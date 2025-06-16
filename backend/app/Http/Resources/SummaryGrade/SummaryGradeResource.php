<?php

namespace App\Http\Resources\SummaryGrade;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;


class SummaryGradeResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'semester_id' => $this->semester_id,
            'subject_id' => $this->subject_id,
            'attempt' => $this->attempt,
            'attendance_score' => formatScore($this->attendance_score),
            'avg_score' => formatScore($this->avg_score),
            'exam1_score' => formatScore($this->exam1_score),
            'exam2_score' => formatScore($this->exam2_score),
            'final_score' => formatScore($this->final_score),
            'evaluation' => $this->evaluation,
            'course_section_id' => $this->course_section_id,
            'created_at' => format_date($this->created_at),
            'note' => $this->note,
        ];
    }
}
