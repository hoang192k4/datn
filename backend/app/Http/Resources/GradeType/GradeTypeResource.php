<?php

namespace App\Http\Resources\GradeType;

use App\Http\Resources\Student\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeTypeResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'weight' => $this->weight,
        ];
    }
}
