<?php

namespace App\Http\Resources\Attendance;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'student_id' => $this->student_id,
            'status' => $this->status,
            'note' => $this->note,
        ];
    }
}