<?php

namespace App\Repositories\Grade;

use App\Models\Grade;
use App\Repositories\EloquentRepository;

class GradeRepository extends EloquentRepository implements GradeRepositoryInterface
{
    public function getModel()
    {
        return Grade::class;
    }
}
