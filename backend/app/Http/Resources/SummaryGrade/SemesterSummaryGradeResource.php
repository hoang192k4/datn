<?php

namespace App\Http\Resources\SummaryGrade;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SemesterSummaryGradeResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->semester_id,
            'name' => $this->semester_name,
            'start_year' => $this->start_year,
            'end_year' => $this->end_year,
            'summaries' => SummaryGradeByStudentResource::collection($this->summaries)
        ];
    }
}
