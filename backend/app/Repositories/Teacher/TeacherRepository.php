<?php

namespace App\Repositories\Teacher;

use App\Enums\Teacher\TeacherStatus;
use App\Models\Teacher;
use App\Repositories\EloquentRepository;

class TeacherRepository extends EloquentRepository implements TeacherRepositoryInterface
{
    public function getModel()
    {
        return Teacher::class;
    }

    public function updateStatus($teacher)
    {
        $teacher->status = $teacher->status === TeacherStatus::Active ? TeacherStatus::Inactive : TeacherStatus::Active;
        $teacher->save();
        return $teacher->status;
    }
}
