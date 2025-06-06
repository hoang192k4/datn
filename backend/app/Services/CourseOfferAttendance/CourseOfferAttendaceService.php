<?php

namespace App\Services\CourseOfferAttendance;

use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;
use App\Servies\CourseOfferAttendance\CourseOfferAttendaceServiceInterface;

class CourseOfferAttendaceService implements CourseOfferAttendaceServiceInterface
{
    protected $repository;

    public function __construct(CourseOfferAttendanceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }
    public function getStudentsByCourseOffer(string $courseOfferId)
    {
        return $this->repository->getStudentsByCourseOffer($courseOfferId);
    }
}