<?php

namespace App\Http\Resources\Attendance;

use App\Enums\Student\StudentStatus;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AttendanceSessionResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' =>$this->id,
            'session_study_date' =>$this->study_date,
            'attendances' => $this->attendances->filter(function ($attendance) {
                return $attendance->student && $attendance->student->status === StudentStatus::Active;
            })->map(function ($attendance) {
                return [
                    'student_id' => $attendance->student->id,
                    'student_code' => $attendance->student->student_code,
                    'student_name' => $attendance->student->name,
                    'status' => $attendance->status,
                    'note' => $attendance->note,
                ];
            })->values()
        ];
    }
}