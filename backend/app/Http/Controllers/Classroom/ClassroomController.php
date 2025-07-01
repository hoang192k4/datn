<?php

namespace App\Http\Controllers\Classroom;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Classroom\ClassroomReourceCollection;
use App\Repositories\Classroom\ClassroomRepositoryInterface;
use Exception;
use PhpOffice\PhpSpreadsheet\Calculation\TextData\Search;

class ClassroomController extends BaseController
{
    public function __construct(
        ClassroomRepositoryInterface $repository,
    ) {
        $this->repository = $repository;
    }
    public function index(SearchRequest $request)
    {
        try {
            $data = $request->validated();
            $key = $data['key'] ?? null;
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;

            $classrooms = $this->repository->getList(['name' => ['like', $key]], [], [], $limit, $page);
            return $this->jsonResponseSuccess(new ClassroomReourceCollection($classrooms));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
