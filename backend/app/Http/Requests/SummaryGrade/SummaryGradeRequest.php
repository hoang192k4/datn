<?php

namespace App\Http\Requests\SummaryGrade;

use App\Enums\CourseSection\GradeStatus;
use App\Enums\SummaryGrade\SummaryGradeType;
use App\Http\Requests\BaseRequest;
use App\Models\SummaryGrade;
use Illuminate\Validation\Rules\Enum;

class SummaryGradeRequest extends BaseRequest
{
    public function methodPut()
    {
        return [
            'score_type' => ['required', new Enum(SummaryGradeType::class)],
            'score' => ['required', 'between:0,10', 'numeric'],
        ];
    }

    public function methodPost()
    {
        return [
            'grade_status' => [new Enum(GradeStatus::class), 'required'],
            'course_section_id' => ['required', 'exists:course_sections,id']
        ];
    }
}
