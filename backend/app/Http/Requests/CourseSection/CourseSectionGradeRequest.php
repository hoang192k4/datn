<?php

namespace App\Http\Requests\CourseSection;

use App\Http\Requests\BaseRequest;

class CourseSectionGradeRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'course_section_id' => 'min:1|exists:course_sections,id|integer|required',
            'key' => 'nullable|string'
        ];
    }
}
