<?php

namespace App\Repositories\Student;

use App\Repositories\EloquentRepositoryInterface;

interface StudentRepositoryInterface extends EloquentRepositoryInterface
{
    public function getStudentsAndGradesByCourseOfferId($courseOfferId);
}
