<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseSectionAttendanceRequest;
use App\Http\Resources\Student\StudentResource;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;
use App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{
    use ResponseWithJson, Log;
    public function __construct(CourseSectionAttendanceServiceInterface $service, CourseSectionAttendanceRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
    }
    public function getStudentsByCourseSection(string $courseSectionId)
    {
        $listStudent = $this->repository->find($courseSectionId)->students;
        $studentJson = $listStudent->map(function ($item) {
            return new StudentResource($item);
        });
        return $this->jsonResponseSuccess($studentJson);
    }

    public function storeAttendanceStudents(CourseSectionAttendanceRequest $request)
    {
        try {
            $result = $this->service->storeAttendanceStudents($request);
            if (!$result)
                return $this->jsonResponseError('Thực hiện không thành công vui lòng xem lại dữ liệu');

            return $this->jsonResponseSuccess($result);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getAllAttendanceByCourseSection(string $courseSectionId)
    {
        try {
            $studentData = $this->service->getAllAttendanceByCourseSection($courseSectionId);
            return $this->jsonResponseSuccess($studentData);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
