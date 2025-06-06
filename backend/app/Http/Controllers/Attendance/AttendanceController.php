<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Http\Resources\Student\StudentResource;
use App\Models\CourseOffer;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;
use App\Services\CourseOfferAttendance\CourseOfferAttendanceServiceInterface;
use App\Supports\ResponseWithJson;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{
    use ResponseWithJson;
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

    public function storeAttendanceStudents(Request $request)
    {
        $result = $this->service->storeAttendanceStudents($request);
        if (!$result)
            return $this->jsonResponseError('Thực hiện không thành công vui lòng xem lại dữ liệu');
        return $this->jsonResponseSuccess($result);
    }

    public function getAllAttendanceByCourseOffer(string $courseOfferId)
    {
        $studentData = [];
        $courseOffer = CourseOffer::with([
            'schedules.sessions.attendances.student'
        ])->find($courseOfferId);
        foreach($courseOffer->schedules as $schedule)
        {
            foreach($schedule->sessions as $session)
            {
                foreach($session->attendances as $attendance)
                {
                    $studentId = $attendance->student->id;
                    $studentName = $attendance->student->name;

                    $studentData[$studentId]['id'] = $studentId;
                    $studentData[$studentId]['name'] = $studentName;
                    $studentData[$studentId]['attendance'][] = [
                        'sessionDate' => $session->study_date,
                        'status' => $attendance->status,
                        'note' => $attendance->note,
                    ];
                }
            }
        }

        return response()->json($studentData);
    }
}
