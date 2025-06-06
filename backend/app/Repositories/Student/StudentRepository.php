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

    public function getStudentsAndGradesByCourseOfferId($courseOfferId)
    {
        return $this->model->whereHas('grades', function ($query) use ($courseOfferId) {
            $query->where('course_offer_id', $courseOfferId);
        })->with(['grades.grade_type' => function ($query) {
            $query->select('id', 'weight');
        }])->get();
    }
}
