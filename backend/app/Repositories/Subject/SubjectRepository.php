<?php

namespace App\Repositories\Subject;

use App\Models\Subject;
use App\Repositories\EloquentRepository;

class SubjectRepository extends EloquentRepository implements SubjectRepositoryInterface
{
    public function getModel()
    {
        return Subject::class;
    }
}