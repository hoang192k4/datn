<?php

namespace App\Services\CourseOfferGrade;

use Exception;
use Illuminate\Http\Request;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Repositories\CourseOfferGrade\CourseOfferGradeRepositoryInterface;
use App\Supports\Log;
use Illuminate\Support\Facades\DB;

class CourseOfferGradeService implements CourseOfferGradeServiceInterface
{
    use Log;
    protected $repository;
    protected $gradeRepository;
    public function __construct(
        CourseOfferGradeRepositoryInterface $repository,
        GradeRepositoryInterface $gradeRepository
    ) {
        $this->repository = $repository;
        $this->gradeRepository = $gradeRepository;
    }

    public function getGradesByStudentAndCourseOffer(Request $request)
    {
        $id = $request->validated()['course_offer_id'];
        $courseOffer = $this->repository->findWithRelation($id, ['students', 'grades']);
        return $courseOffer->students ?? false;
    }


    public function addGradeColumn(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $courseOfferId = $data['course_offer_id'];
            $gradeTypeId = $data['grade_type_id'];
            $maxAttempt = $this->gradeRepository->getMaxAttemptByCourseOffer($courseOfferId, $gradeTypeId);

            $studentIds = $this->repository->find($courseOfferId)->students->pluck('id');

            $newAttempt = $maxAttempt + 1;

            foreach ($studentIds as $studentId) {
                $grade = [
                    'course_offer_id' => $courseOfferId,
                    'grade_type_id' => $gradeTypeId,
                    'student_id' => $studentId,
                    'attempt' => $newAttempt,
                ];
                $this->gradeRepository->create($grade);
            }
            DB::commit();
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            DB::rollBack();
            return false;
        }
    }
}
