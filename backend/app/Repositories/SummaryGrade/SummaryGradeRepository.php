<?php

namespace App\Repositories\SummaryGrade;

use App\Models\SummaryGrade;
use App\Repositories\EloquentRepository;

class SummaryGradeRepository extends EloquentRepository implements SummaryGradeRepositoryInterface
{
    public function getModel()
    {
        return SummaryGrade::class;
    }

    public function findByStudentSubject($studentId, $subjectId)
    {
        return $this->model->where('student_id', $studentId)
            ->where('subject_id', $subjectId)->orderByDesc('attempt')->first();
    }
}
