<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Notification\NotificationType;
use App\Enums\SendToUserType;

class NotificationRequest extends BaseRequest
{
    public function methodPost()
    {
        return  [
            'title' => ['required', 'string'],
            'body' => ['required', 'string'],
            'receiver_ids' => 'array|nullable',
            'receiver_ids.*' => 'integer',
            'send_to' => [new Enum(SendToUserType::class), 'nullable'],
        ];
    }

    public function methodGet()
    {
        return [
            'limit' => ['integer', 'min:1'],
            'page' => ['integer', 'min:1'],
            'type' => [new Enum(NotificationType::class), 'nullable']
        ];
    }
}
