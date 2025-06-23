<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Student\StudentRequest;
use App\Services\Student\StudentServiceInterface;
use Exception;

class StudentController extends BaseController
{
    protected $studentService;
    public function __construct(
        StudentServiceInterface $studentService,
    ) {
        $this->studentService = $studentService;
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
}
