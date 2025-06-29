<?php

namespace App\Http\Resources\Class;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClassResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'teacher_id' => $this->teacher_id,
            'teacher_name' => optional($this->teacher)->name,
            'status' => $this->status
        ];
    }
}