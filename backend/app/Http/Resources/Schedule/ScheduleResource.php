<?php

namespace App\Http\Resources\Schedule;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CourseSection\CourseSectionScheduleResource;

class ScheduleResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $periodTimes = config('schedule.period_times');
        return [
            'id' => $this->id,
            'period_start' => $this->period_start,
            'period_end' => $this->period_end,
            'period_number' => $this->period_number,
            'session' => $this->session,
            'classroom' => [
                'id' => $this->classroom->id,
                'name' => $this->classroom->name,
            ],
            'day_of_week' => $this->day_of_week,
            'course_section' => new CourseSectionScheduleResource($this->course_section),
            'start_time' => $periodTimes[$this->period_start]['start'],
            'end_time' => $periodTimes[$this->period_end]['end'],
        ];
    }
}
