<?php

namespace App\Http\Controllers\Student;

use Exception;
use App\Imports\StudentImport;
use App\Exports\StudentsExport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Requests\Student\StudentRequest;
use App\Exceptions\ModelNotFoundByIdException;
use Illuminate\Validation\ValidationException;
use App\Services\Student\StudentServiceInterface;
use App\Http\Requests\Student\StudentExportRequest;
use App\Http\Requests\Student\StudentImportRequest;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Http\Resources\Student\StudentResourceCollection;


class StudentController extends BaseController
{
    protected $studentService;
    protected $studentRepository;
    public function __construct(
        StudentServiceInterface $studentService,
        StudentRepositoryInterface $studentRepository

    ) {
        $this->studentService = $studentService;
        $this->studentRepository = $studentRepository;
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin')->except('getAllStudents');
    }

    public function create(StudentRequest $request)
    {
        try {
            $student = $this->studentService->create($request);
            if (!$student) {
                return $this->jsonResponseError();
            }
            return $this->jsonResponseSuccess();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function update(StudentRequest $request, $id)
    {
        try {
            $isUpdated = $this->studentService->update($request, $id);
            if (!$isUpdated)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không tìm thấy instance theo id ' . $id);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getAllStudents(SearchRequest $request)
    {
        try {
            $students = $this->studentService->getAllStudents($request);
            return $this->jsonResponseSuccess(new StudentResourceCollection($students));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }




    public function importStudentsExcel(StudentImportRequest $request)
    {
        try {
            $request->validated();
            Excel::import(new StudentImport(), $request->file('file'));
            return $this->jsonResponseSuccessNoData();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Thêm không thành công', 422, $e->errors());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function exportStudentsExcel(StudentExportRequest $request)
    {
        try {
            $data = $request->validated();
            $status = $data['status'] ?? null;
            return Excel::download(new StudentsExport($this->studentRepository, $status), 'danh-sach-sinh-vien.xlsx');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
