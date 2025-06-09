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
}
