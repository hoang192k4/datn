<?php

namespace App\Http\Requests\Grade;

use App\Http\Requests\BaseRequest;

class GradeImportRequest extends BaseRequest
{

    public function methodPost()
    {
        return [
            'course_section_id' => 'exists:course_sections,id|required',
            'file' => 'file|required|mimes:xlsx,xls',
        ];
    }
}
