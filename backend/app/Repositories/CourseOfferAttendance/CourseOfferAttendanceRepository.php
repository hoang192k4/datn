<?php 

namespace App\Repositories\CourseOfferAttendance;

use App\Models\CourseOffer;
use App\Repositories\CourseOfferGrade\CourseOfferGradeRepositoryInterface;
use App\Repositories\EloquentRepository;

class CourseOfferAttendanceRepository extends EloquentRepository implements CourseOfferGradeRepositoryInterface
{
    public function getModel()
    {
        return CourseOffer::class;
    }
}