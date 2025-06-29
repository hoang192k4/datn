<?php

namespace App\Repositories\Semester;

use App\Models\Semester;
use App\Repositories\EloquentRepository;

class SemesterRepository extends EloquentRepository implements SemesterRepositoryInterface
{
    public function getModel()
    {
        return Semester::class;
    }
}
