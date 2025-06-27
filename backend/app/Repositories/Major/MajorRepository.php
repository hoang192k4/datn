<?php

namespace App\Repositories\Major;

use App\Models\Major;
use App\Repositories\EloquentRepository;

class MajorRepository extends EloquentRepository implements MajorRepositoryInterface
{
    public function getModel()
    {
        return Major::class;
    }
}
