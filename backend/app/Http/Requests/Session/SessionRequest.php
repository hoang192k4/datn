<?php

namespace App\Http\Requests\Session;

use App\Http\Requests\BaseRequest;

class SessionRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'session_id'=> 'required|exists:sessions,id|integer|min:1',
        ];
    }
}