<?php

namespace App\Http\Requests\Teacher;

use App\Enums\Gender;
use App\Models\Teacher;
use App\Http\Requests\BaseRequest;
use App\Enums\Teacher\TeacherStatus;
use Illuminate\Support\Facades\Hash;
use App\Traits\AuthTeacherApi;
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
            'password_current' => 'string|max:255',
            'password_update' => 'string|max:255',
            'gender' => [new Enum(Gender::class)],
            'role_id' => "exists:roles,id"
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            $password = $this['password_current'];
            if ($this->teacher && $password && !Hash::check($password, $this->teacher->password)) {
                $validator->errors()->add('password', 'Mật khẩu không đúng. Vui lòng nhập đúng mật khẩu');
            }
        });
    }

    public function messages()
    {
        return [
            'teacher_code' => 'Mã giảng viên đã tồn tại vui lòng nhập mã khác!',
            'email.unique' => 'Email đã tồn tại vui lòng nhập email khác',
            'email.email' => 'Email không đúng định dạng'
        ];
    }
}
