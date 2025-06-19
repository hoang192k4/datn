<?php

namespace App\Repositories\Student;

use App\Repositories\EloquentRepositoryInterface;

interface StudentRepositoryInterface extends EloquentRepositoryInterface
{
    public function getStudentsAndGradesBycourseSectionId($courseSectionId);
    public function getMyStudents($teacherId, $page, $limit, $key);
}
