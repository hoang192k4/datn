<?php

namespace App\Http\Requests\CourseSection;

use App\Enums\CourseSection\CourseSectionStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class CourseSectionRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'name' => 'required|string',
            'start_date' => 'required|date|date_format:Y-m-d',
            'end_date' => 'required|date|date_format:Y-m-d',
            'week_total' => 'required|integer',
            'subject_id' => 'required|exists:subjects,id',
            'semester_id' => 'required|exists:semesters,id',
            'teacher_id' => 'exists:teachers,id',
            'class_id' => 'exists:classes,id'
        ];
    }

    public function methodPut()
    {
        return [
            'name' => 'string',
            'start_date' => 'date|date_format:Y-m-d',
            'end_date' => 'date|date_format:Y-m-d',
            'week_total' => 'integer',
            'class_id' => 'exists:classes,id',
            'subject_id' => 'exists:subjects,id',
            'semester_id' => 'exists:semesters,id',
            'teacher_id' => 'exists:teachers,id',
        ];
    }

    public function methodPatch()
    {
        return [
            'status' => [new Enum(CourseSectionStatus::class)]
        ];
    }
}
