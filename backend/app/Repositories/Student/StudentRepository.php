<?php

namespace App\Repositories\Student;

use App\Models\Student;
use App\Repositories\EloquentRepository;

class StudentRepository extends EloquentRepository implements StudentRepositoryInterface
{
    public function getModel()
    {
        return Student::class;
    }

    public function getStudentsAndGradesBycourseSectionId($courseSectionId)
    {
        return $this->model->whereHas('grades', function ($query) use ($courseSectionId) {
            $query->where('course_offer_id', $courseSectionId);
        })->with(['grades.grade_type' => function ($query) {
            $query->select('id', 'weight');
        }])->get();
    }
}
