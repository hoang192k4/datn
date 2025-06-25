<?php

namespace App\Http\Requests\Teacher;

use App\Enums\Gender;
use App\Enums\Teacher\TeacherStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class TeacherRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'teacher_code' => 'required|string|unique:teachers,teacher_code|max:255',
            'email' => 'required|email|max:255|unique:teachers,email',
            'name' => 'required|string|max:255',
            'password' => 'required|max:255|string',
            'date_of_birth' => 'date|required',
            'address' => 'required|string|max:255',
            'gender' => [new Enum(Gender::class), 'required'],
            'status' => [new Enum(TeacherStatus::class), 'required'],
            'role_id' => "required|exists:roles,id"
        ];
    }

    public function methodPut()
    {
        return [
            'teacher_code' => 'string|unique:teachers,teacher_code|max:255',
            'email' => 'email|max:255|unique:teachers,email',
            'name' => 'string|max:255',
            'password' => 'max:255|string',
            'date_of_birth' => 'date',
            'address' => 'string|max:255',
            'gender' => [new Enum(Gender::class)],
            'status' => [new Enum(TeacherStatus::class)],
            'role_id' => "exists:roles,id"
        ];
    }
}
