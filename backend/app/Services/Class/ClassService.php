<?php

namespace App\Services\Class;

use App\Enums\Class\ClassStatus;
use App\Models\ClassStudent;
use App\Models\CustomClass;
use App\Repositories\CustomClass\ClassRepositoryInterface;
use Illuminate\Http\Request;

class ClassService implements ClassServiceInterface
{
    protected $repository;

    public function __construct(ClassRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function getListClasses(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['key'] ?? null;

        $query = CustomClass::query();
        if ($key)
            $query->where('name', 'like', '%' . $key . '%');
        $classes = $query->where('status', ClassStatus::InProgress)->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)->appends(['limit' => $limit]);
        return $classes;
    }

    public function getListClassesFilter(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['key'] ?? null;
        $status = $data['status'] ?? null;

        $query = CustomClass::query();

        if ($key)
            $query->where(function ($q) use ($key) {
                $q->where('name', 'like', '%' . $key . '%')
                    ->orWhereHas('teacher', function ($q) use ($key) {
                        $q->where('name', 'like', '%' . $key . '%');
                    });
            });
        if ($status)
            $query->where('status', $status);
        $classes = $query->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)->appends(['limit' => $limit]);
        return $classes;
    }

    public function create(Request $request)
    {
        $data = $request->validated();
        $name = $data['name'];
        $teacherId = $data['teacher_id'];
        $startTime = $data['start_time'];
        $endTime = $data['end_time'];
        $studentsId = $data['studentsId'] ?? null;
        $dataClass = [
            'name' => $name,
            'teacher_id' => $teacherId,
            'start_time' => $startTime,
            'end_time' => $endTime
        ];

        $class = $this->repository->create($dataClass);
        if ($studentsId) {
            $dataInsert = [];
            foreach ($studentsId as $studentId) {
                $dataInsert[] = [
                    'class_id' => $class->id,
                    'student_id' => $studentId,
                ];
            }

            ClassStudent::insert($dataInsert);
        }
        return true;
    }

    public function update(Request $request, string $classId)
    {
        $data = $request->validated();
        $name = $data['name'];
        $teacherId = $data['teacher_id'];
        $startTime = $data['start_time'];
        $endTime = $data['end_time'];
        $studentsId = $data['studentsId'] ?? null;
        $dataClass = [
            'name' => $name,
            'teacher_id' => $teacherId,
            'start_time' => $startTime,
            'end_time' => $endTime
        ];
        $result = $this->repository->update($classId, $dataClass);
        if ($result) {
            $class = $this->repository->find($classId);
            $class->students()->sync($studentsId);
        }

        return true;
    }
}
