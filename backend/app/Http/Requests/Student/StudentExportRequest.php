<?php

namespace App\Http\Requests\Student;

use App\Enums\Student\StudentStatus;
use App\Enums\SummaryGrade\SummaryGradeType;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class StudentExportRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'status' => ['nullable', new Enum(StudentStatus::class)],
        ];
    }
}
