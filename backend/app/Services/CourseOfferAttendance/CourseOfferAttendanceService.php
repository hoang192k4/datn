<?php

namespace App\Services\CourseOfferAttendance;


use App\Models\Session;
use App\Models\CourseOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Services\CourseOfferAttendance\CourseOfferAttendanceServiceInterface;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Illuminate\Support\Facades\DB;

class CourseOfferAttendanceService implements CourseOfferAttendanceServiceInterface
{
    use Log;
    protected $repository;

    public function __construct(CourseOfferAttendanceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function storeAttendanceStudents(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $date = $data['date'];
            $courseOfferId = $data['course_offer_id']; 
            $attendanceStudents = $data['attendance'];  
            $sessionId = Session::whereHas('schedule', function ($query) use ($courseOfferId) {
                $query->where('course_offer_id', $courseOfferId);
            })->where('study_date', $date)->first()?->id;
            if ($sessionId == null)
                return false;
            return $this->repository->storeAttendanceStudents($sessionId, $attendanceStudents);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            Db::rollBack();
            return false;
        }
    }

    public function getAllAttendanceByCourseOffer(string $courseOfferId)
    {
        DB::beginTransaction();
        try {
            $studentData = [];
            $courseOffer = $this->repository->getAllAttendanceByCourseOffer($courseOfferId);
            if ($courseOffer) {
                foreach ($courseOffer->schedules as $schedule) {
                    foreach ($schedule->sessions as $session) {
                        foreach ($session->attendances as $attendance) {
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
                DB::commit();
                return  $studentData;
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
}
