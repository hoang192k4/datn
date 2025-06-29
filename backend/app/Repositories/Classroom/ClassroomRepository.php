<?php

namespace App\Repositories\Classroom;

use App\Models\ClassRoom;
use App\Repositories\EloquentRepository;

class ClassroomRepository extends EloquentRepository implements ClassroomRepositoryInterface
{
    public function getModel()
    {
        return ClassRoom::class;
    }
}
