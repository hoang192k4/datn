<?php

namespace App\Http\Controllers\Class;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Class\ClassResourceCollection;
use App\Services\Class\ClassServiceInterface;
use Exception;
use Illuminate\Http\Request;

class ClassController extends BaseController
{
    public function __construct(ClassServiceInterface $service)
    {
        $this->service = $service;
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
}
