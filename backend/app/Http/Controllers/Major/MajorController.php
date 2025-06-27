<?php

namespace App\Http\Controllers\Major;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Major\MajorResource;
use App\Repositories\Major\MajorRepositoryInterface;
use Exception;

class MajorController extends BaseController
{

    public function __construct(
        MajorRepositoryInterface $repository
    ) {
        $this->repository = $repository;
    }

    public function index()
    {
        try {
            $majors = $this->repository->getAll();
            return $this->jsonResponseSuccess(MajorResource::collection($majors));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
