<?php

namespace App\Repositories\CourseSection;

use App\Repositories\EloquentRepositoryInterface;

interface CourseSectionRepositoryInterface extends EloquentRepositoryInterface
{
    public function getCourseSectionByTeacherSlug($slug, $limit, $page);
}
