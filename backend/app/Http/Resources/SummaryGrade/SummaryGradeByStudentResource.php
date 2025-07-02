<?php

namespace App\Http\Resources\SummaryGrade;

use App\Models\CourseSection;
use App\Models\Semester;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SummaryGradeByStudentResource extends JsonResource
{
    public function toArray(Request $request)
    {

        return [
            'id' => $this->id,
            'semester_id' => $this->semester_id,
            'semester_name' => $this->semester_name ?? null,
            'subject_id' => $this->subject_id,
            'subject_name' => $this->subject_name ?? null,
            'attempt' => $this->attempt,
            'start_year' => $this->start_year,
            'end_year' => $this->end_year,
            'attendance_score' => $this->attendance_score ? formatScore($this->attendance_score) : null,
            'avg_score' => $this->avg_score ?  formatScore($this->avg_score) : null,
            'exam1_score' => $this->exam1_score ? formatScore($this->exam1_score) : null,
            'exam2_score' => $this->exam2_score ? formatScore($this->exam2_score) : null,
            'final_score' => $this->final_score ? formatScore($this->final_score) : null,
            'evaluation' => $this->evaluation,
            'course_section_id' => $this->course_section_id,
            'course_section_name' => $this->course_section_name ?? null,
            'created_at' => format_date($this->created_at),
            'note' => $this->note,
        ];
    }
}
