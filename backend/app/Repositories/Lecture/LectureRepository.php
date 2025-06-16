<?php 

namespace App\Repositories\Lecture;

use App\Models\Lecture;
use App\Repositories\EloquentRepository;

class LectureRepository extends EloquentRepository implements LectureRepositoryInterface
{
    public function getModel()
    {
        return Lecture::class;
    }
}