<?php

namespace App\Repositories\CourseSectionGrade;

use App\Models\CourseSection;
use App\Repositories\EloquentRepository;

class CourseSectionGradeRepository extends EloquentRepository implements CourseSectionGradeRepositoryInterface
{
    public function getModel()
    {
        return CourseSection::class;
    }
}
