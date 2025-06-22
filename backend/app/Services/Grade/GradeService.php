<?php

namespace App\Services\Grade;

use Exception;
use App\Supports\Log;
use Illuminate\Support\Arr;
use Illuminate\Http\Request;
use App\Exceptions\ModelNotFoundByIdException;
use App\Http\Requests\Grade\GradeRequest;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use Illuminate\Validation\ValidationException;

class GradeService implements GradeServiceInterface
{
    use Log;

    protected $summaryGradeSerivce;
    protected $repository;
    protected $courseSectionRepository;

    public function __construct(
        GradeRepositoryInterface $repository,
        SummaryGradeServiceInterface $summaryGradeService,
        CourseSectionRepositoryInterface $courseSectionRepository,
    ) {
        $this->repository = $repository;
        $this->summaryGradeSerivce = $summaryGradeService;
        $this->courseSectionRepository = $courseSectionRepository;
    }

    public function updateOrCreate(Request $request, $id): object|bool
    {
        try {
            $data = $request->validated();
            $instance = $this->repository->find($id);
            if ($instance) {
                $data = Arr::only($data, ['score']);
            }
            $response =  $this->repository->updateOrCreateById($id, $data);
            $this->summaryGradeSerivce->updateSummaryGrade($response->student_id, $response->course_section_id);
            return  $response;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function create(Request $request): object|bool
    {
        try {
            $data = $request->validated();
            $response =  $this->repository->create($data);
            $this->summaryGradeSerivce->updateSummaryGrade($response->student_id, $response->course_section_id);
            return  $response;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function getFileNameExportGrade($courseSectionId): string
    {
        $courseSection = $this->courseSectionRepository->find($courseSectionId);
        $slug = generate_slug($courseSection->name, '_');
        return "bang_diem_" . $slug . ".xlsx";
    }
}
