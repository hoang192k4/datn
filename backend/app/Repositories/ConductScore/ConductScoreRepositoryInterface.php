<?php

namespace App\Repositories\ConductScore;

use App\Repositories\EloquentRepositoryInterface;

interface ConductScoreRepositoryInterface extends EloquentRepositoryInterface
{
    public function findConductScoreByStudent($studentId);
}