<?php

namespace App\Services\Teacher;

use App\Enums\Teacher\TeacherStatus;
use App\Supports\Log;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use Exception;

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
        return $this->teacherRepository->create($data);
    }

    public function update($teacher, Request $request)
    {
        $data = $request->validated();
        if (array_key_exists('name', $data))
            $data['slug'] = Str::slug($data['name']);
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

        return  $this->teacherRepository->getList(
            [],
            ['created_at' => 'asc'],
            [],
            $limit,
            $page,
            ['teacher_code' => ['like', $key], 'email' => ['like', $key], 'name' => ['like', $key]]
        );
    }
}
