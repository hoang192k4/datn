<?php

namespace App\Http\Requests\Post;

use App\Enums\PublicStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class PostSearchRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'nullable|min:1|integer',
            'page' => 'nullable|min:1|integer',
            'key' => 'string|nullable',
            'status' => [new Enum(PublicStatus::class), 'nullable'],
        ];
    }
}
