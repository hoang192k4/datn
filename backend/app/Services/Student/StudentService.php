<?php

namespace App\Services\Student;

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
}
