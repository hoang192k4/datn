<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Notification\NotificationType;

class NotificationRequest extends BaseRequest
{
    public function methodPost()
    {
        return  [
            'title' => ['required', 'string'],
            'body' => ['required', 'string'],
            'receiver_ids' => 'array|required',
            'receiver_ids.*' => 'integer',
            'type' => [new Enum(NotificationType::class), 'required'],
        ];
    }
}
