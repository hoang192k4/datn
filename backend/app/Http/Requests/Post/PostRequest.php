<?php

namespace App\Http\Requests\Post;

use App\Http\Requests\BaseRequest;

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
}
