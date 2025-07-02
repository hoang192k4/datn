<?php

namespace App\Repositories\Teacher;

use App\Repositories\EloquentRepositoryInterface;

interface TeacherRepositoryInterface extends EloquentRepositoryInterface
{
    public function updateStatus($teacher);
    public function upsert(array $data, array $uniqueBy);
    public function getTeachersByStudentId($studentId, $page, $limit, $key);
}
