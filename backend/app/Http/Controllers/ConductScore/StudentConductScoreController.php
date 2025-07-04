<?php

namespace App\Http\Controllers\ConductScore;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use App\Http\Resources\ConductScore\StudentConductSocreResource;
use App\Repositories\ConductScore\ConductScoreRepositoryInterface;
use App\Traits\AuthStudentApi;
use Exception;
use Illuminate\Http\Request;

class StudentConductScoreController extends BaseController
{
    use AuthStudentApi;

    protected $conductScoreRepository;
    public function __construct(ConductScoreRepositoryInterface $conductScoreRepository)
    {

        $this->conductScoreRepository = $conductScoreRepository;
        $this->middleware('auth:student');
    }

    public function getConductScoreMyStudent()
    {
        try {
            $studentId = $this->getCurrentStudentId();
            $conductScores = $this->conductScoreRepository->findConductScoreByStudent($studentId);
            if (!$conductScores)
                return $this->jsonResponseError();
            $result = $conductScores->map(function ($item) {
                return new StudentConductSocreResource($item);
            });
            return $this->jsonResponseSuccess($result);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống!', 500);
        }
    }
}
