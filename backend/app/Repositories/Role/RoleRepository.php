<?php

namespace App\Repositories\Role;

use App\Models\Role;
use App\Repositories\EloquentRepository;

class RoleRepository extends EloquentRepository implements RoleRepositoryInterface
{
    public function getModel()
    {
        return Role::class;
    }
}