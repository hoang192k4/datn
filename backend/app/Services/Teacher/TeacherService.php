<?php

namespace App\Services\Teacher;

use App\Enums\Teacher\TeacherStatus;
use App\Models\Teacher;
use App\Supports\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use Exception;
use Maatwebsite\Excel\Concerns\ToArray;

use function PHPUnit\Framework\isEmpty;
use function PHPUnit\Framework\isNull;

class TeacherService implements TeacherServiceInterface
{
    use Log;
    protected $teacherRepository;
    public function __construct(TeacherRepositoryInterface $teacherRepository)
    {
        $this->teacherRepository = $teacherRepository;
    }

    public function create(Request $request)
    {
        $data = $request->validated();
        $data['slug'] = Str::slug($data['name']);
        $subjectIds = $data['subjects'] ?? [];
        unset($data['subjects']);
        $teacher =  $this->teacherRepository->create($data);
        if (!empty($subjectIds)) {
            $teacher->subjects()->attach($subjectIds);
        }
        if (!$teacher)
            return false;
        return true;
    }

    public function update($teacher, Request $request)
    {
        $data = $request->validated();
        $subjectIds = $data['subjects'];
        unset($data['subjects']);
        if (array_key_exists('password_current', $data) && array_key_exists('password_update', $data))
            $data['password'] = $data['password_update'];
        if (array_key_exists('name', $data))
            $data['slug'] = Str::slug($data['name']);
        $teacher->subjects()->sync($subjectIds);
        return $this->teacherRepository->update($teacher->id, $data);
    }

    public function updateStatus($teacher)
    {
        return $this->teacherRepository->updateStatus($teacher);
    }

    public function getAllTeachers(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['key'] ?? null;
        $status = $data['status'] ?? null;
        $roleName = $data['role'] ?? null;

        $query = Teacher::query();

        if ($roleName) {
            $query->whereHas('role', function ($q) use ($roleName) {
                $q->where('name', $roleName);
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($key) {
            $query->where(function ($q) use ($key) {
                $q->where('teacher_code', 'like', '%' . $key . '%')
                    ->orWhere('name', 'like', '%' . $key . '%')
                    ->orWhere('email', 'like', '%' . $key . '%');
            });
        }

        $teacherList = $query->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)
            ->appends(['limit' => $limit]);
        return $teacherList;
    }

    public function getTeachersByStudentId(Request $request, $studentId)
    {
        $data = $request->validated();
        $key = $data['key'] ?? null;
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;

        return $this->teacherRepository->getTeachersByStudentId($studentId, $page, $limit, $key);
    }
}
