<?php

namespace App\Http\Requests\Student;

use App\Enums\Gender;
use App\Enums\Student\StudentStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Enum;

class StudentRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'student_code' => 'required|string|unique:students,student_code',
            'name' => 'required|string',
            'email' => 'required|string|email|unique:students,email',
            'password' => ['required', 'string'],
            'date_of_birth' => 'required|date|date_format:Y-m-d',
            'address' => 'required|string',
            'gender' => [new Enum(Gender::class), 'required'],
            'enrollment_date' => ['date', 'required', 'date_format:Y-m-d'],
            'graduation_date' => ['date', 'nullable', 'date_format:Y-m-d'],
            'status' => ['nullable', new Enum(StudentStatus::class)],
            'major_id' => ['nullable', 'exists:majors,id'],
        ];
    }

    public function methodPut()
    {
        return [
            'name' => ['nullable', 'string'],
            'email' => ['nullable', 'email', Rule::unique('students', 'email')->ignore($this->route('id'))],
            'password' => ['nullable', 'string'],
            'date_of_birth' => ['nullable', 'date', 'date_format:Y-m-d'],
            'address' =>  ['nullable', 'string'],
            'gender' => ['nullable', new Enum(Gender::class)],
            'enrollment_date' => ['date', 'nullable', 'date_format:Y-m-d'],
            'graduation_date' => ['nullable', 'date', 'date_format:Y-m-d'],
            'major_id' => ['nullable', 'exists:majors,id'],
            'status' => ['nullable', new Enum(StudentStatus::class)],
        ];
    }
}
