<?php

namespace App\Http\Controllers\Student;

use Exception;
use App\Imports\StudentImport;
use Maatwebsite\Excel\Facades\Excel;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Requests\Student\StudentRequest;
use App\Services\Student\StudentServiceInterface;
use App\Http\Requests\Student\StudentImportRequest;
use App\Http\Resources\Student\StudentResourceCollection;
use Maatwebsite\Excel\Validators\ValidationException;

class StudentController extends BaseController
{
    protected $studentService;
    public function __construct(
        StudentServiceInterface $studentService,
    ) {
        $this->studentService = $studentService;
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
            return $this->jsonResponseErrorValidate('Thêm không thành công', 422, $e->failures());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
