<?php

namespace App\Http\Resources\Attendance;

use App\Enums\Session\SessionStatus;
use App\Http\Resources\Session\SessionResource;
use App\Models\Session;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionAttendanceResource extends JsonResource
{
    public function toArray(Request $request)
    {

        return [
            'id' => $this->id,
            'sessions' => Session::whereHas('schedule', function ($query) {
                $query->where('course_section_id', $this->id);
            })->where('status', SessionStatus::Approve)
                ->orderBy('study_date', 'asc')
                ->get()
                ->map(function ($session) {
                    return [
                        new SessionResource($session)
                    ];
                }),
        ];
    }
}
