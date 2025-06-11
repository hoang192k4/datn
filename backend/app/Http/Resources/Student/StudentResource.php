<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'student_code' => $this->student_code,
            'email' => $this->email,
            'date_of_birth' => format_date($this->date_of_birth),
            'address' => $this->address,
            'gender' => $this->gender,
            'enrollment_date' => format_date($this->enrollment_date),
            'graduation_date' => format_date($this->graduation_date),
            'major' => optional($this->major)->name,
            'status' => $this->status,
        ];
    }
}
