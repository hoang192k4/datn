<?php

namespace App\Services\CourseOfferAttendance;


use App\Models\Session;
use App\Models\CourseOffer;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Services\CourseOfferAttendance\CourseOfferAttendanceServiceInterface;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;

class CourseOfferAttendanceService implements CourseOfferAttendanceServiceInterface
{
    protected $repository;

    public function __construct(CourseOfferAttendanceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function storeAttendanceStudents(Request $request)
    {
        $data = $request->all();
        $date = $data['date'];
        $courseOfferId = $data['courseOfferId'];
        $attendanceStudents = $data['attendance'];
        $session_id = Session::whereHas('schedule', function ($query) use ($courseOfferId) {
            $query->where('course_offer_id', $courseOfferId);
        })->where('study_date', $date)->first()?->id;
        if ($session_id == null)
            return false;
        return $this->repository->storeAttendanceStudents($session_id, $attendanceStudents);
    }
}
