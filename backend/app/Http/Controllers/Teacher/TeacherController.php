<?php

namespace App\Http\Controllers\Teacher;

use App\Exports\TeacherExport;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Teacher\MyTeacherRequest;
use App\Http\Requests\Teacher\TeacherExportRequest;
use App\Http\Requests\Teacher\TeacherImportRequest;
use App\Http\Requests\Teacher\TeacherRequest;
use App\Http\Resources\Teacher\TeacherResourceCollection;
use App\Imports\TeacherImport;
use App\Models\Teacher;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Services\Teacher\TeacherServiceInterface;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Validators\ValidationException;
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
            $request->validated();
            Excel::import(new TeacherImport($this->repository), $request->file('file'));
            return $this->jsonResponseSuccessNoData('Import danh sách giảng viên thành công!');
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Import không thành công!', 422, $e->failures());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getTeacherListByStatus(TeacherExportRequest $request)
    {
        try {
            $data = $request->validated();
            return Excel::download(new TeacherExport($data), 'danh_sach_giang_vien.xlsx');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
