<?php

namespace App\Repositories\Student;

use App\Repositories\EloquentRepositoryInterface;

interface StudentRepositoryInterface extends EloquentRepositoryInterface
{
    public function getStudentsAndGradesBycourseSectionId($courseSectionId);
    public function getMyStudents($teacherId, $page, $limit, $key);
    public function getStudentsWithGradesAndSummaryByCourseSection($courseSectionId);
    public function upsert(array $data, array $uniqueBy);
    public function getAllIndexed();
    public function getEmailMap();

}
