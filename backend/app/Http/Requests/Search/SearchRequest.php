<?php

namespace App\Http\Requests\Search;

use App\Http\Requests\BaseRequest;


class SearchRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'integer|nullable',
            'page' => 'integer|nullable',
            'key' => 'string|nullable',
        ];
    }
}
