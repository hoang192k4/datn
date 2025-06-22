<?php

namespace App\Http\Requests\File;

use App\Http\Requests\BaseRequest;

class AttendanceFileRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'file' => 'required|file|mimes:xlsx'
        ];
    }
}