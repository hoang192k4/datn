<?php

namespace App\Http\Requests\Auth;

use App\Http\Requests\BaseRequest;

class ChangePasswordRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ];
    }
}
