<?php

namespace App\Http\Requests\Teacher;

use App\Http\Requests\BaseRequest;

class TeacherImportRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ];
    }
}
