<?php

namespace App\Http\Requests\Grade;

use App\Http\Requests\BaseRequest;

class GradeColumnRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'course_offer_id' => 'exists:course_offers,id|required',
            'grade_type_id' => 'exists:grade_types,id|required',
        ];
    }
}
