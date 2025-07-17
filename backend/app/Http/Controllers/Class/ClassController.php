<?php

namespace App\Http\Controllers\Class;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Class\ClassRequest;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Class\ClassResourceCollection;
use App\Repositories\CustomClass\ClassRepositoryInterface;
use App\Services\Class\ClassServiceInterface;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ClassController extends BaseController
{
    public function __construct(ClassServiceInterface $service, ClassRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin');
    }

    public function getListClasses(SearchRequest $request)
    {
        try {
            $classes = $this->service->getListClasses($request);
            if (!$classes)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new ClassResourceCollection($classes));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function getListClassesFilter(ClassRequest $request)
    {
        try {
            $classes = $this->service->getListClassesFilter($request);
            if (!$classes)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new ClassResourceCollection($classes));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function create(ClassRequest $request)
    {
        try {
            $result = $this->service->create($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Thêm lớp chính khóa thành công');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function update(ClassRequest $request, string $classId)
    {
        try {
            $result = $this->service->update($request, $classId);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Cập nhật lớp chính khóa thành công');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function updateStatus(ClassRequest $request, string $classId)
    {
        try {
            $result = $this->service->updateStatus($request, $classId);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Cập nhật trạng thái thành công');
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Thực hiện không thành công',400,$e->errors());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }
}
