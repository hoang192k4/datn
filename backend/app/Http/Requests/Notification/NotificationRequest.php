<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;

class NotificationRequest extends BaseRequest
{

    public function methodPost()
    {
        return [
            'title' => 'required|string',
            'body' => 'required|string',
            'device_tokens' => 'required|array',
            'data' => 'nullable|array'
        ];
    }
}
