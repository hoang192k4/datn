<?php

namespace App\Repositories\SummaryGrade;

use App\Repositories\EloquentRepositoryInterface;

interface SummaryGradeRepositoryInterface extends EloquentRepositoryInterface
{
    public function findByStudentSubject($studentId, $subjectId);
    public function findByStudent($studentId);
}
