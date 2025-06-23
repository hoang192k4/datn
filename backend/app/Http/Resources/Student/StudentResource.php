<?php

namespace App\Http\Resources\Student;

use App\Enums\Class\ClassStatus;
use App\Enums\ClassStudent\ClassStudentStatus;
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
            'date_of_birth' => $this->date_of_birth,
            'address' => $this->address,
            'gender' => $this->gender,
            'class' => optional($this->classes->where('status', ClassStatus::InProgress)->first())->name,
            'homeroom_teacher' => optional(optional($this->classes->where('status', ClassStatus::InProgress)->first())->teacher)->name,
            'enrollment_date' => $this->enrollment_date,
            'graduation_date' => $this->graduation_date,
            'major' => optional($this->major)->name,
            'status' => $this->status,
        ];
    }
}
