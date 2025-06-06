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

    public function getMaxAttemptByCourseOffer($courseOfferId, $gradeTypeId): int|false
    {
        $maxAttempt =
            $this->model->where('course_offer_id', $courseOfferId)
            ->where('grade_type_id', $gradeTypeId)
            ->max('attempt');

        return $maxAttempt ?? false;
    }
}
