<?php

namespace App\Http\Requests\Notification;

use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use App\Enums\Notification\NotificationType;
use App\Enums\PublicStatus;

class NotificationCourseSectionRequest extends BaseRequest
{
    public function methodPost()
    {
        return  [
            'title' => ['required', 'string'],
            'body' => ['required', 'string'],
            'course_section_id' => ['required', 'exists:course_sections,id'],
            'public_type' => [new Enum(PublicStatus::class), 'nullable']
        ];
    }

    public function messages()
    {
        return [
            'course_section_id.required' => 'Vui lòng chọn lớp học phần.'
        ];
    }
}
