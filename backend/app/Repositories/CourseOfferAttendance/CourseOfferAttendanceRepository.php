<?php 

namespace App\Repositories\CourseOfferAttendance;

use App\Models\CourseOffer;
use App\Repositories\CourseOfferAttendance\CourseOfferAttendanceRepositoryInterface;
use App\Repositories\EloquentRepository;

class CourseOfferAttendanceRepository extends EloquentRepository implements CourseOfferAttendanceRepositoryInterface
{
    public function getModel()
    {
        return CourseOffer::class;
    }

    public function getStudentsByCourseOffer(string $courseOfferId)
    {
        
    }
}