<?php

namespace App\Http\Requests\Schedule;

use App\Enums\DayOfWeek;
use App\Enums\Schedule\SessionStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;


class MyScheduleRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'filter_date' => ['nullable', 'date', 'date_format:Y-m-d'],
        ];
    }
}
