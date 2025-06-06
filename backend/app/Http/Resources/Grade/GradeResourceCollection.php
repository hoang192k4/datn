<?php

namespace App\Http\Resources\Grade;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class GradeResourceCollection extends ResourceCollection
{
    public function toArray(Request $request)
    {
        return [
            'grades' => $this->collection->map(function ($item) {
                return new GradeResource($item);
            }),
        ];
    }
}
