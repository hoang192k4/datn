<?php

namespace App\Services\Schedule;

use Illuminate\Http\Request;

interface ScheduleServiceInterface
{
    public function create(Request $request);
}
