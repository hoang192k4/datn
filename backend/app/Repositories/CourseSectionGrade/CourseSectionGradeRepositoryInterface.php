<?php

namespace App\Repositories\CourseSectionGrade;

use App\Repositories\EloquentRepositoryInterface;

interface CourseSectionGradeRepositoryInterface extends EloquentRepositoryInterface
{
    public function deleteGradeColumn($courseSectionId, $gradeTypeId, $attempt): bool;
    public function updateGradeTypeToPrivate($courseSectionId, $gradeTypeId, $attempt): bool;
    public function updateGradeTypeToPublic($courseSectionId, $gradeTypeId, $attempt): bool;
}
