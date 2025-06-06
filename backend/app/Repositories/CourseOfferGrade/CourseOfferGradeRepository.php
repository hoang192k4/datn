<?php

namespace App\Repositories\CourseOfferGrade;

use App\Models\CourseOffer;
use App\Repositories\EloquentRepository;

class CourseOfferGradeRepository extends EloquentRepository implements CourseOfferGradeRepositoryInterface
{
    public function getModel()
    {
        return CourseOffer::class;
    }
}
