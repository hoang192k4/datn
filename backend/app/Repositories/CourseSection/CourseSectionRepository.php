<?php

namespace App\Repositories\CourseSection;

use App\Enums\CourseSection\CourseSectionStatus;
use App\Models\CourseSection;
use App\Repositories\EloquentRepository;

class CourseSectionRepository extends EloquentRepository implements CourseSectionRepositoryInterface
{
    public function getModel()
    {
        return CourseSection::class;
    }

    public function getCourseSectionByTeacherSlug($slug, $limit, $page)
    {
        return $this->model->where('status', '!=', CourseSectionStatus::InRegister)->whereHas('teacher', function ($query) use ($slug) {
            $query->where('slug', $slug);
        })->paginate($limit, ['*'], 'page', $page);
    }
}
