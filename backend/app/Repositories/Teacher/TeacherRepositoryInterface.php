<?php

namespace App\Repositories\Teacher;

use App\Repositories\EloquentRepositoryInterface;

interface TeacherRepositoryInterface extends EloquentRepositoryInterface
{
    public function updateStatus($teacher);
}
