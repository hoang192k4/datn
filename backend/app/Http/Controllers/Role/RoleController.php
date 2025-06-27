<?php

namespace App\Http\Controllers\Role;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Role\RoleResource;
use App\Repositories\Role\RoleRepositoryInterface;
use Exception;
use Illuminate\Http\Request;

class RoleController extends BaseController
{
    public function __construct(RoleRepositoryInterface $repository)
    {
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin');
        $this->repository = $repository;
    }

    public function getRoles()
    {
        try {
            $roles = $this->repository->getAll();
            $roleReousce = $roles->map(function($role) {
                return new RoleResource($role);
            });
            return $this->jsonResponseSuccess($roleReousce);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
