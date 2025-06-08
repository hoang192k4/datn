<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseOffer\CourseOfferAttendanceRequest;
use App\Http\Resources\Attendance\AttendanceResource;
use App\Http\Resources\Student\StudentResource;
use App\Models\CourseOffer;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;
use App\Services\CourseOfferAttendance\CourseOfferAttendanceServiceInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{
    use ResponseWithJson, Log;
    public function __construct(CourseOfferAttendanceServiceInterface $service, CourseOfferAttendanceRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
    }
    public function getStudentsByCourseOffer(string $courseOfferId)
    {
        $listStudent = $this->repository->find($courseOfferId)->students;
        $studentJson = $listStudent->map(function ($item) {
            return new StudentResource($item);
        });
        return response()->json($studentJson);
    }

    public function storeAttendanceStudents(CourseOfferAttendanceRequest $request)
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

    public function getAllAttendanceByCourseOffer(string $courseOfferId)
    {
        try {
            $studentData = $this->service->getAllAttendanceByCourseOffer($courseOfferId);
            return $this->jsonResponseSuccess($studentData);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
