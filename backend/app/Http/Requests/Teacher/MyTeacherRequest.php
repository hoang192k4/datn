<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\BaseRequest;
use App\Enums\Teacher\TeacherStatus;
use Illuminate\Validation\Rules\Enum;

class MyTeacherRequest extends  BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'integer|nullable',
            'page' => 'integer|nullable',
            'key' => 'string|nullable',
            'status' => [new Enum(TeacherStatus::class), 'nullable'],
            'role' => 'exists:roles,name|nullable'
        ];
    }
}
