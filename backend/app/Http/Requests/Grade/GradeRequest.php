<?php

namespace App\Http\Requests\Grade;

use App\Http\Requests\BaseRequest;

class GradeRequest extends BaseRequest
{
    public function methodPut()
    {
        return [
            'course_offer_id' => 'exists:course_offers,id|nullable',
            'grade_type_id' => 'exists:grade_types,id|nullable',
            'student_id' => 'exists:students,id|nullable',
            'id' => 'exists:grades,id|integer|min:0',
            'score' =>  'required|numeric|between:1,10',
        ];
    }
}
