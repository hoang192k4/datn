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
            'teacher_code' => $this->teacher_code,
            'name' => $this->name,
            'email' => $this->email,
            'slug' => $this->slug,
            'date_of_birth' => $this->date_of_birth,
            'gender' => $this->gender,
            'status' => $this->status,
            'address' => $this->address,
            'subjects' => $this->subjects->map(function($item) {
                return [
                    'value'=> $item->id,
                    'label' => $item->name . '- số tính chỉ ' . $item->credit
                ];
            }),
            'role' => $this->role->name,
            'role_id' => $this->role_id,
            'created_at' => $this->created_at,
        ];
    }
}
