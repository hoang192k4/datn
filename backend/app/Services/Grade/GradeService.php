<?php

namespace App\Services\Grade;

use App\Exceptions\ModelNotFoundByIdException;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Supports\Log;
use Exception;
use Illuminate\Http\Request;

class GradeService implements GradeServiceInterface
{
    use Log;

    protected $repository;
    public function __construct(
        GradeRepositoryInterface $repository
    ) {
        $this->repository = $repository;
    }
    public function updateOrCreate(Request $request, $id): object|bool
    {
        try {
            $data = $request->validated();
            $score = $data['score'];

            return $this->repository->updateOrCreateById($id, ['score' => $score]);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
