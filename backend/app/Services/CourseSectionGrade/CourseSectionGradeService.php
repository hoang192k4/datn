<?php

namespace App\Services\CourseSectionGrade;

use App\Enums\Student\StudentStatus;
use Exception;
use Illuminate\Http\Request;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Repositories\CourseSectionGrade\CourseSectionGradeRepositoryInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Supports\Log;
use Illuminate\Support\Facades\DB;

class CourseSectionGradeService implements CourseSectionGradeServiceInterface
{
    use Log;
    protected $repository;
    protected $gradeRepository;
    protected $summaryGradeService;
    public function __construct(
        CourseSectionGradeRepositoryInterface $repository,
        GradeRepositoryInterface $gradeRepository,
        SummaryGradeServiceInterface $summaryGradeService,
    ) {
        $this->repository = $repository;
        $this->gradeRepository = $gradeRepository;
        $this->summaryGradeService = $summaryGradeService;
    }

    public function getGradesByStudentAndcourseSection(Request $request)
    {
        $id = $request->validated()['course_section_id'];
        $key = $request->validated()['key'] ?? '';
        $courseSection = $this->repository->findWithRelation($id, ['students', 'grades']);
        return $courseSection->students()
            ->where('status', StudentStatus::Active)
            ->where(function ($query) use ($key) {
                $query->where('student_code', 'like', "%$key%")
                    ->orWhere('name', 'like', "%$key%");
            })
            ->distinct()
            ->get();
    }


    public function addGradeColumn(Request $request)
    {

        DB::beginTransaction();
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $gradeTypeId = $data['grade_type_id'];
            $maxAttempt = $this->gradeRepository->getMaxAttemptBycourseSection($courseSectionId, $gradeTypeId);

            $studentIds = $this->repository->find($courseSectionId)->students->pluck('id');

            $newAttempt = $maxAttempt + 1;

            foreach ($studentIds as $studentId) {
                $grade = [
                    'course_section_id' => $courseSectionId,
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


    public function deleteGradeColumn(Request $request): bool
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $gradeTypeId = $data['grade_type_id'];
            $attempt = $data['attempt'];
            $type = $data['type'];

            if ($type === 'delete') {
                $isGradeTypeDeleted = $this->repository->deleteGradeColumn($courseSectionId, $gradeTypeId, $attempt);
                if (!$isGradeTypeDeleted) {
                    DB::rollBack();
                    return false;
                }
            } elseif ($type === 'private') {
                $isGradeTypeUpdated = $this->repository->updateGradeTypeToPrivate($courseSectionId, $gradeTypeId, $attempt);
                if (!$isGradeTypeUpdated) {
                    DB::rollBack();
                    return false;
                }
            } elseif ($type === 'public') {
                $isGradeTypeUpdated = $this->repository->updateGradeTypeToPublic($courseSectionId, $gradeTypeId, $attempt);
                if (!$isGradeTypeUpdated) {
                    DB::rollBack();
                    return false;
                }
            }

            $isSummaryGradeUpdated = $this->summaryGradeService->updateSummaryGrades($courseSectionId);
            if (!$isSummaryGradeUpdated) {
                DB::rollBack();
                return false;
            }
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function exportGrade() {}
}
