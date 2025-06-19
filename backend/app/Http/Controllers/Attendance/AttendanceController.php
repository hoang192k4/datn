<?php

namespace App\Http\Controllers\Attendance;

use App\Enums\Student\StudentStatus;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseSectionAttendanceRequest;
use App\Http\Requests\Session\SessionRequest;
use App\Http\Resources\Attendance\AttendanceResource;
use App\Http\Resources\Attendance\AttendanceSessionResource;
use App\Http\Resources\Attendance\AttendanceStudentResource;
use App\Http\Resources\Attendance\CourseSectionStudentAttendanceResource;
use App\Http\Resources\Attendance\SessionAttendanceResource;
use App\Http\Resources\Student\StudentResource;
use App\Models\Student;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;
use App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{
    use ResponseWithJson, Log;
    public function __construct(CourseSectionAttendanceServiceInterface $service, CourseSectionAttendanceRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
        $this->middleware('auth:teacher');
    }
    public function getStudentsByCourseSection(string $courseSectionId)
    {
        $listStudent = $this->repository->find($courseSectionId)->students->where('status', StudentStatus::Active);
        $studentJson = $listStudent->filter(function ($item) {
            return $item->status === StudentStatus::Active;
        })->map(function ($item) {
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
            return $this->jsonResponseSuccess(array_values($studentData));
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getSessionsByCourseSection(CourseSectionAttendanceRequest $request)
    {
        try {
            $result = $this->service->getSessionsByCourseSection($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new SessionAttendanceResource($result));
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getAttendancesBySession(SessionRequest $request)
    {
        try {
            $result = $this->service->getAttendancesBySession($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new AttendanceSessionResource($result));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
