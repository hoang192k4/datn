<?php

namespace App\Http\Resources\Subject;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectSearchResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'subject_name' => $this->name,
        ];
    }
}