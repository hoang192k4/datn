<?php

namespace App\Repositories\ConductScore;

use App\Models\ConductScore;
use App\Repositories\EloquentRepository;

class ConductScoreRepository extends EloquentRepository implements ConductScoreRepositoryInterface
{
    public function getModel()
    {
        return ConductScore::class;
    }

    public function findConductScoreByStudent($studentId)
    {
        return $this->model->where('student_id',$studentId)->orderBy('date','asc')->get();
    }
}
