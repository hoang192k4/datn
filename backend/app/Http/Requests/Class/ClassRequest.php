<?php

namespace App\Http\Requests\Class;

use App\Enums\Class\ClassStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class ClassRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'integer|nullable',
            'page' => 'integer|nullable',
            'status' => [new Enum(ClassStatus::class), 'nullable'],
            'key' => 'string|nullable',
        ];
    }

    public function methodPost()
    {
        return [
            'name' => 'required|string',
            'teacher_id' => 'required|exists:teachers,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'studentsId' => 'exists:students,id'
        ];
    }

    public function methodPut()
    {
        return [
            'name' => 'required|string',
            'teacher_id' => 'required|exists:teachers,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'studentsId' => 'exists:students,id'
        ];
    }
}
