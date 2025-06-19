<?php

namespace App\Http\Requests\CourseSection;

use App\Http\Requests\BaseRequest;

class CourseSectionAttendanceRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'session_id' =>'required|exists:sessions,id',
            'attendance' => 'required'
        ];
    }

    public function methodGet(){
        return [
            'course_section_id' => 'min:1|exists:course_sections,id|integer|required',
        ];
    }
}
