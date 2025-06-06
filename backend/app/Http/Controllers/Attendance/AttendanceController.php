<?php

namespace App\Http\Controllers\Attendance;

use App\Http\Controllers\BaseController;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;
use App\Servies\CourseOfferAttendance\CourseOfferAttendaceServiceInterface;
use Illuminate\Http\Request;

class AttendanceController extends BaseController
{

    public function __construct(CourseOfferAttendaceServiceInterface $service, CourseOfferAttendanceRepositoryInterface $repository)
    {
        $this->service = $service;
        $this->repository = $repository;
    }
    public function getStudentsByCourseOffer(string $courseOfferId)
    {
        return response()->json($this->service->getStudentsByCourseOffer($courseOfferId));
    }
}
