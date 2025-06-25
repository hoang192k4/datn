<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\BaseRequest;

class MyTeacherRequest extends  BaseRequest
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
