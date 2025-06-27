<?php

namespace App\Services\Student;

use App\Enums\Student\StudentStatus;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Supports\Log;
use Exception;
use Illuminate\Http\Request;

class StudentService implements StudentServiceInterface
{
    use Log;
    protected $studentRepository;
    public function __construct(
        StudentRepositoryInterface $studentRepository,
    ) {
        $this->studentRepository = $studentRepository;
    }

    public function create(Request $request)
    {
        try {
            $data = $request->validated();
            return $this->studentRepository->create($data);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function getAllStudents(Request $request)
    {
        try {
            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;
            $key = $data['key'] ?? null;
            $status = $data['status'] ?? null;

            $filter = [];
            if (!is_null($status)) {
                $filter['status'] = $status;
            }

            return $this->studentRepository->getList($filter, ['student_code' => 'desc'], [], $limit, $page, ['student_code' => ['like', $key], 'name' => ['like', $key]]);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->validated();
        $this->studentRepository->findOrFailById($id);
        return $this->studentRepository->update($id, $data);
    }

    public function getFileExportName($status)
    {
        if ($status) {
            $statusName = generate_slug(StudentStatus::getDesciption($status), '_');
            return 'danh_sach_sinh_vien_' . $statusName . '.xlsx';
        }
        return 'danh_sach_sinh_vien.xlsx';
    }
}
