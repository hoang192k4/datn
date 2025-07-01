<?php

namespace App\Http\Requests\Schedule;

use App\Enums\DayOfWeek;
use App\Enums\Schedule\SessionStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

class ScheduleRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'key' => ['nullable', 'string'],
            'day_of_week' => ['nullable', new Enum(DayOfWeek::class)],
            'session' => ['nullable', new Enum(SessionStatus::class)],
            'page' => ['nullable', 'numeric', 'min:1'],
            'limit' => ['nullable', 'numeric', 'min:1'],
            'semester' => ['nullable', 'exists:semesters,id'],
            'classroom_id' => ['nullable', 'exists:classrooms,id']
        ];
    }

    public function methodPost()
    {
        return [
            'course_section_id' => ['required', 'exists:course_sections,id'],
            'day_of_week' => ['required', new Enum(DayOfWeek::class)],
            'period_start' => ['required', 'between:1,12', 'integer'],
            'period_number' => ['required', 'integer', 'min:1', 'max:12'],
            'classroom_id' => ['required', 'exists:classrooms,id']
        ];
    }

    public function methodPut()
    {
        return [
            'course_section_id' => ['nullable', 'exists:course_sections,id'],
            'day_of_week' => ['nullable', new Enum(DayOfWeek::class)],
            'period_start' => ['nullable', 'between:1,12', 'integer'],
            'period_number' => ['nullable', 'integer', 'min:1', 'max:12'],
            'classroom_id' => ['nullable', 'exists:classrooms,id']
        ];
    }


    public function withValidator(Validator $validator)
    {
        $validator->after(function () use ($validator) {
            $periodStart = $this['period_start'];
            $periodNumber = $this['period_number'];
            $periodEnd = $periodStart + $periodNumber - 1;

            if ($periodStart <= 6 && $periodEnd > 6) {
                $validator->errors()->add('period_number', 'Tiết kết thúc buổi sáng không được lớn hơn 6');
            } else if ($periodStart <= 12 && $periodEnd > 12) {
                $validator->errors()->add('period_number', 'Tiết kết thúc buổi chiều không được lớn hơn 12');
            }
        });
    }
}
