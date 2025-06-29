<?php

namespace App\Repositories\CourseSection;

use App\Models\CourseSection;
use App\Repositories\EloquentRepository;

class CourseSectionRepository extends EloquentRepository implements CourseSectionRepositoryInterface
{
    public function getModel()
    {
        return CourseSection::class;
    }

}
