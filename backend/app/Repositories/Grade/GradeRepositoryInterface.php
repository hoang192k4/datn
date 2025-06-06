<?php

namespace App\Repositories\Grade;

use App\Repositories\EloquentRepositoryInterface;

interface GradeRepositoryInterface extends EloquentRepositoryInterface
{
    public function getMaxAttemptByCourseOffer($courseOfferId, $gradeTypeId): int|false;
}
