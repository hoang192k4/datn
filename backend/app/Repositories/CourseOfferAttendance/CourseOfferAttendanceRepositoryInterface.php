<?php 

namespace App\Repositories\CourseOfferAttendance;

use App\Repositories\EloquentRepositoryInterface;

interface CourseOfferAttendanceRepositoryInterface extends EloquentRepositoryInterface
{
    public function getStudentsByCourseOffer(string $courseOfferId);
}