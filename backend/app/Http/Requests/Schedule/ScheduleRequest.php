<?php

namespace App\Http\Requests\Schedule;

use App\Enums\DayOfWeek;
use App\Enums\Schedule\SessionStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

class ScheduleRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'course_section_id' => ['required', 'exists:course_sections,id'],
            'day_of_week' => ['required', new Enum(DayOfWeek::class)],
            'session' => ['required', new Enum(SessionStatus::class)],
            'period_start' => ['required', 'between:1,12', 'integer'],
            'period_number' => ['required', 'integer', 'min:1', 'max:12'],
            'classroom_id' => ['required', 'exists:classrooms,id']
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function () use ($validator) {
            $periodStart = $this['period_start'];
            $periodNumber = $this['period_number'];

            if (($periodStart + $periodNumber - 1) > 12) {
                $validator->errors()->add('period_number', 'Tiết kết thúc không được lớn hơn 12');
            }
        });
    }
}
