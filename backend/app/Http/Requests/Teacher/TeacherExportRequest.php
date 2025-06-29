<?php

namespace App\Http\Requests\Teacher;

use App\Enums\Teacher\TeacherStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class TeacherExportRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'status' => [new Enum(TeacherStatus::class), 'nullable'],
            'role_id' => ['exists:teachers,role_id', 'nullable']
        ];
    }
}