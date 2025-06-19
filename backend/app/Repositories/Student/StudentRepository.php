<?php

namespace App\Repositories\Student;

use App\Enums\Student\StudentStatus;
use App\Models\Student;
use App\Models\Teacher;
use App\Repositories\EloquentRepository;
use Illuminate\Support\Facades\DB;

class StudentRepository extends EloquentRepository implements StudentRepositoryInterface
{
    public function getModel()
    {
        return Student::class;
    }

    public function getStudentsAndGradesBycourseSectionId($courseSectionId)
    {
        return $this->model->where('status', StudentStatus::Active)->whereHas('grades', function ($query) use ($courseSectionId) {
            $query->where('course_section_id', $courseSectionId);
        })->with(['grades.grade_type' => function ($query) {
            $query->select('id', 'weight');
        }])->get();
    }


    public function getMyStudents($teacherId, $page, $limit, $key)
    {
        $students = $this->model->whereHas('course_sections', function ($query) use ($teacherId) {
            $query->where('teacher_id', $teacherId);
        });
        if ($key) {
            $students->where(function ($query) use ($key) {
                $query->where('name', 'like', '%' . $key . '%')
                    ->orWhere('student_code', 'like', '%' . $key . '%');
            });
        }
        return $students->where('status', StudentStatus::Active)->paginate($limit, ['*'], 'page', $page);
    }
}
