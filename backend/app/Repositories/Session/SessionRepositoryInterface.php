<?php

namespace App\Repositories\Session;

use App\Repositories\EloquentRepositoryInterface;


interface SessionRepositoryInterface extends EloquentRepositoryInterface
{
    public function getSchedulesByTeacher($teacherId, $startOfWeek, $endOfWeek);
    public function getSchedulesByStudent($Id, $startOfWeek, $endOfWeek);
}
