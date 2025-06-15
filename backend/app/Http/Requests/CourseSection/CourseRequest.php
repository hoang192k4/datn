<?php

namespace App\Http\Requests\CourseSection;

use App\Http\Requests\BaseRequest;

class CourseRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'integer|min:1|nullable',
            'page' => 'integer|min:1|nullable',
            'key' => 'string|nullable'
        ];
    }
}
