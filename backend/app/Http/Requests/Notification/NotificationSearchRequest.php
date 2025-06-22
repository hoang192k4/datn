<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class NotificationSearchRequest extends BaseRequest
{

    public function methodGet()
    {
        return [
            'limit' => ['integer', 'min:1'],
            'page' => ['integer', 'min:1'],
            'status' => ['in:read,unread', 'nullable'],
            'key' => ['string', 'nullable']
        ];
    }
}
