<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Student\MyStudentRequest;
use App\Http\Resources\Student\StudentNotificationResource;
use App\Http\Resources\Student\StudentNotificationResourceCollection;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Traits\AuthTeacherApi;
use Exception;

class MyStudentController extends BaseController
{

    protected $studentRepository;
    use AuthTeacherApi;
    public function __construct(
        StudentRepositoryInterface $studentRepository
    ) {
        $this->studentRepository = $studentRepository;
        $this->middleware('auth:teacher');
    }

    public function getMyStudents(MyStudentRequest $request)
    {
        try {
            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;
            $key = $data['key'] ?? null;
            $teacherId = $this->getCurrentTeacherId();
            $students = $this->studentRepository->getMyStudents($teacherId, $page, $limit, $key);
            return $this->jsonResponseSuccess(new StudentNotificationResourceCollection($students));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
