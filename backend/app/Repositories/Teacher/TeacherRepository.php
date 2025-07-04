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
    public function upsert(array $data, array $uniqueBy)
    {
        $this->model->upsert($data, $uniqueBy);
    }

    public function getTeachersByStudentId($studentId, $page, $limit, $key)
    {
        $query = $this->model->query();
        if ($key) {
            $query->where(function ($q) use ($key) {
                $q->where('teacher_code', 'like', '%' . $key . '%')
                    ->orWhere('name', 'like', '%' . $key . '%')
                    ->orWhere('email', 'like', '%' . $key . '%');
            });
        }
        $query->where('status', TeacherStatus::Active);
        $query->whereHas('course_sections.students', function ($q) use ($studentId) {
            $q->where('id', $studentId);
        });
        return $query->orderBy('created_at', 'desc')->paginate($limit, ['*'], 'page', $page);
    }

    public function getTeachersBySubject($subjectId)
    {
        return Teacher::whereHas('subjects', function ($q) use ($subjectId) {
            $q->where('subject_id', $subjectId);
        })->where('status', TeacherStatus::Active)->get();
    }
}
