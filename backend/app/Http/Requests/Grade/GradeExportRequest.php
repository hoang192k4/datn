<?php

namespace App\Http\Requests\Grade;

use App\Http\Requests\BaseRequest;

class GradeExportRequest extends BaseRequest
{

    public function methodPost()
    {
        return [
            'course_section_id' => 'exists:course_sections,id|required',
            'selected_columns' => 'array|required',
        ];
    }
}
