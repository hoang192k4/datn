<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Requests\Teacher\MyTeacherRequest;
use App\Http\Requests\Teacher\TeacherImportRequest;
use App\Http\Requests\Teacher\TeacherRequest;
use App\Http\Resources\Teacher\TeacherResourceCollection;
use App\Imports\TeacherImport;
use App\Models\Teacher;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Services\Teacher\TeacherServiceInterface;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class TeacherController extends BaseController
{
    public function __construct(TeacherServiceInterface $serivce, TeacherRepositoryInterface $repository)
    {
        $this->service = $serivce;
        $this->repository = $repository;
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin');
    }

    public function create(TeacherRequest $request)
    {
        try {
            $result = $this->service->create($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function update(Teacher $teacher, TeacherRequest $request)
    {
        try {
            $result = $this->service->update($teacher, $request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function updateStatus(Teacher $teacher)
    {
        try {
            $teacher_status = $this->service->updateStatus($teacher);
            if (!$teacher_status)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess($teacher_status);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getAllTeachers(MyTeacherRequest $request)
    {
        try {
            $teachers = $this->service->getAllTeachers($request);
            if (!$teachers)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new TeacherResourceCollection($teachers));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function importTeachersExcel(TeacherImportRequest $request)
    {
        try {
            Excel::import(new TeacherImport($this->repository), $request->file('file'));
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Không thể nhập dữ liệu. Vui lòng kiểm tra lại các cột và nội dung', 400);
        }
    }
}
