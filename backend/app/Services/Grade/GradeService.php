<?php

namespace App\Services\Grade;

use App\Exceptions\ModelNotFoundByIdException;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Supports\Log;
use Exception;
use Illuminate\Http\Request;

class GradeService implements GradeServiceInterface
{
    use Log;

    protected $summaryGradeSerivce;
    protected $repository;

    public function __construct(
        GradeRepositoryInterface $repository,
        SummaryGradeServiceInterface $summaryGradeService,
    ) {
        $this->repository = $repository;
        $this->summaryGradeSerivce = $summaryGradeService;
    }

    public function updateOrCreate(Request $request, $id): object|bool
    {
        try {
            $data = $request->validated();
            $score = $data['score'];
            $instance = $this->repository->findOrFailById($id);
            $response =  $this->repository->updateOrCreateById($id, ['score' => $score]);
            $this->summaryGradeSerivce->updateSummaryGrade($instance->student_id, $instance->course_offer_id);
            return  $response;
        } catch (ModelNotFoundByIdException $e) {
            throw new ModelNotFoundByIdException('grade', $id);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
