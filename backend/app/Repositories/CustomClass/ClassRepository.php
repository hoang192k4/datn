<?php

namespace App\Repositories\CustomClass;

use App\Models\CustomClass;
use App\Repositories\EloquentRepository;

class ClassRepository extends EloquentRepository implements ClassRepositoryInterface
{
    public function getModel()
    {
        return CustomClass::class;
    }
}
