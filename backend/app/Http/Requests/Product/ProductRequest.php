<?php

namespace App\Http\Requests\Product;

use App\Http\Requests\BaseRequest;

class ProductRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'limit' => 'integer|min:1',
            'page' => 'integer|min:1'
        ];
    }

    public function methodPost()
    {
        return [
            'name' => 'required'
        ];
    }

    public function methodPut()
    {
        return [
            'name' => 'nullable',
        ];
    }
}
