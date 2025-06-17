<?php

namespace App\Http\Requests\Grade;

use App\Http\Requests\BaseRequest;

class GradeColumnRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'course_section_id' => 'exists:course_sections,id|required',
            'grade_type_id' => 'exists:grade_types,id|required',
        ];
    }

    public function methodDelete()
    {
        return [
            'course_section_id' => 'required|exists:course_sections,id|integer',
            'grade_type_id' => 'required|exists:grade_types,id|integer',
            'attempt' => 'integer|required',
            'type' => 'required|in:delete,private,public'
        ];
    }
}
