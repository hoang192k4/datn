<?php

namespace App\Http\Requests\Post;

use App\Enums\PublicStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class PostRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'slug' => ['required', 'string'],
            'limit' => 'nullable|min:1|integer',
            'page' => 'nullable|min:1|integer'
        ];
    }

    public function methodPut()
    {
        return [
            'title' => ['nullable', 'string'],
            'content' => ['nullable', 'string'],
            'course_section_id' => ['nullable', 'exists:course_sections,id'],
            'push_notification' => ['nullable', 'in:true,1'],
            'status' => ['nullable', new Enum(PublicStatus::class)],
        ];
    }

    public function messages()
    {
        return [
            'course_section_id.required' => 'Vui lòng chọn lớp học phần.'
        ];
    }
}
