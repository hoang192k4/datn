<?php

namespace App\Http\Resources\Teacher;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'slug' => $this->slug,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'status' => $this->status,
            'address' => $this->address,
            'role' => $this->role->name,
            'created_at' => $this->created_at,
        ];
    }
}
