<?php

namespace App\Http\Requests\Student;

use App\Enums\SummaryGrade\SummaryGradeType;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class MyStudentRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'integer|nullable',
            'page' => 'integer|nullable',
            'key' => 'string|nullable'
        ];
    }
}
