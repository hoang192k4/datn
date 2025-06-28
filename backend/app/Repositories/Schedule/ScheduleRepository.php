<?php

namespace App\Repositories\Schedule;

use App\Models\Schedule;
use App\Repositories\EloquentRepository;

class ScheduleRepository extends EloquentRepository implements ScheduleRepositoryInterface
{
    public function getModel()
    {
        return Schedule::class;
    }
}
