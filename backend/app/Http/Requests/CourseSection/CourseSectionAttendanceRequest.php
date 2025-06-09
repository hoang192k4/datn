<?php

namespace App\Http\Requests\CourseSection;

use App\Http\Requests\BaseRequest;

class CourseSectionAttendanceRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'date' => 'required|date',
            'course_section_id' => 'required|min:1|exists:course_sections,id|integer',
            'attendance' => 'required'
        ];
    }
}
