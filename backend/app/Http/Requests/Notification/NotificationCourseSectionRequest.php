<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Notification\NotificationType;

class NotificationCourseSectionRequest extends BaseRequest
{
    public function methodPost()
    {
        return  [
            'title' => ['required', 'string'],
            'body' => ['required', 'string'],
            'course_section_id' => ['required', 'exists:course_sections,id'],
        ];
    }
}
