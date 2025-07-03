<?php

namespace App\Http\Resources\Schedule;

use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\CourseSection\CourseSectionScheduleResource;

class TeacherScheduleResource extends JsonResource
{
    public function toArray(Request $request)
    {
        $start = $this['start_of_week'];

        $dayNames = [
            1 => 'Thứ 2',
            2 => 'Thứ 3',
            3 => 'Thứ 4',
            4 => 'Thứ 5',
            5 => 'Thứ 6',
            6 => 'Thứ 7',
            7 => 'Chủ nhật',
        ];
        $days = [];
        for ($i = 1; $i <= 7; $i++) {
            $day = $start->copy()->addDays($i - 1); // vì start là thứ 2
            $days[$i] = [
                'day_name' => $dayNames[$i],
                'date' => $day->toDateString(),
                'morning' => [],
                'afternoon' => [],
            ];
        }

        foreach ($this['sessions'] as $session) {
            $dayKey = Carbon::parse($session->study_date)->dayOfWeek; // 0–6

            $days[$dayKey][$session->session][] = [
                'course_section_name' => $session->course_section_name,
                'classroom_name' => $session->classroom_name,
                'start_time' => Carbon::parse($session->start_time)->format('H:i'),
                'end_time' => Carbon::parse($session->end_time)->format('H:i'),
            ];
        }


        return [
            'week' => [
                'start' => $this['start_of_week']->toDateString(),
                'end' => $this['end_of_week']->toDateString(),
                'prev_week' => $this['start_of_week']->copy()->subWeek()->toDateString(), // thứ 2 tuần trước
                'next_week' => $this['start_of_week']->copy()->addWeek()->toDateString(), // thứ 2 tuần sau
            ],
            'schedule' => $days,
        ];
    }
}
