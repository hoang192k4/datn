<?php

namespace App\Http\Requests\Auth;

use App\Enums\Gender;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class UpdateRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            "name" => "required|string|max:255",
            "email" => "required|email|max:255",
            "date_of_birth" => "required|date", 
            "gender" => ["required", new Enum(Gender::class)], 
            "address" => "required|string|max:255",
        ];
    }
}
