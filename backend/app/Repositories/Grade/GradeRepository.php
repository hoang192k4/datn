<?php

namespace App\Repositories\Grade;

use App\Models\Grade;
use App\Repositories\EloquentRepository;

class GradeRepository extends EloquentRepository implements GradeRepositoryInterface
{
    public function getModel()
    {
        return Grade::class;
    }

    public function getMaxAttemptBycourseSection($courseSectionId, $gradeTypeId): int|false
    {
        $maxAttempt =
            $this->model->where('course_section_id', $courseSectionId)
            ->where('grade_type_id', $gradeTypeId)
            ->max('attempt');

        return $maxAttempt ?? false;
    }
}
