<?php

namespace App\Repositories\Teacher;

use App\Models\Teacher;
use App\Repositories\EloquentRepository;

class TeacherRepository extends EloquentRepository implements TeacherRepositoryInterface
{
    public function getModel(){
        return Teacher::class;
    }
}
