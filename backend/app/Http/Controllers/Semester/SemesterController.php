<?php

namespace App\Http\Controllers\Semester;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\Semester\SemesterResource;
use App\Repositories\Semester\SemesterRepositoryInterface;
use Exception;
use Illuminate\Http\Request;

class SemesterController extends BaseController
{
    public function __construct(SemesterRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getSemesters()
    {
        try {
            $semesters = $this->repository->getAll();
            $result = $semesters->map(function ($semester) {
                return new SemesterResource($semester);
            });
            return $this->jsonResponseSuccess($result);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
