<?php

namespace App\Http\Requests\CourseSection;

use App\Http\Requests\BaseRequest;

class CourseSectionStudentRequest extends BaseRequest
{
    public function methodDelete()
    {
        return [
            'course_section_id' => 'required|exists:course_sections,id|min:1',
            'student_id' => 'required|exists:students,id|min:1',
        ];
    }

    public function methodPost()
    {
        return [
            'course_section_id' => 'required|exists:course_sections,id|min:1',
            'student_id' => 'required|exists:students,id|min:1',
        ];
    }
}
