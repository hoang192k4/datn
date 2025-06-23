<?php

namespace App\Http\Requests\Student;

use App\Enums\Gender;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class StudentImportRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ];
    }
}
