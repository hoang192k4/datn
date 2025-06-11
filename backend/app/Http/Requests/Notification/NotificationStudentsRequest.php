<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;

class NotificationStudentsRequest extends BaseRequest
{

    public function methodPost()
    {
        return [
            'title' => 'required|string',
            'body' => 'required|string',
            'student_ids' => 'required|array',
        ];
    }
}
