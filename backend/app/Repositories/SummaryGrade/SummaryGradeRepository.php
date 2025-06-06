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
}
