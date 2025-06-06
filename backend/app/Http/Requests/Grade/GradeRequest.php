<?php

namespace App\Http\Requests\Grade;

use App\Http\Requests\BaseRequest;

class GradeRequest extends BaseRequest
{
    public function methodPut()
    {
        return [
            'course_offer_id' => 'exists:course_offers,id|required',
            'grade_type_id' => 'exists:grade_types,id|required',
            'student_id' => 'exists:students,id|required',
        ];
    }
}
