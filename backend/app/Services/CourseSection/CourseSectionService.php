<?php

namespace App\Services\CourseSection;

use Exception;
use App\Supports\Log;
use Illuminate\Http\Request;
use App\Traits\AuthTeacherApi;
use App\Enums\CourseSection\CourseSectionStatus;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;


class CourseSectionService implements CourseSectionServiceInterface
{
    use Log;
    protected $courseSectionRepository;
    use AuthTeacherApi;
    public function __construct(
        CourseSectionRepositoryInterface $courseSectionRepository
    ) {
        $this->courseSectionRepository = $courseSectionRepository;
    }

    public function getCourseSectionByTeacher(Request $request)
    {
        try {
            $currentTeacherId = $this->getCurrentTeacherId();

            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;
            $key = $request->validated()['key'] ?? null;

            return  $this->courseSectionRepository->getList(['teacher_id' => $currentTeacherId, 'status' => CourseSectionStatus::InProgress, 'name' => ['like', $key]], ['name' => 'asc', 'created_at' => 'desc'], [], $limit, $page);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function detachStudentByCourseSection(Request $request)
    {
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $studentId = $data['student_id'];
            $courseSection = $this->courseSectionRepository->find($courseSectionId);
            $result = $courseSection->students()->detach([$studentId]);
            if (!$result)
                return false;
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function attachStudentByCourseSection(Request $request)
    {
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $studentId = $data['student_id'];
            $courseSection = $this->courseSectionRepository->find($courseSectionId);
            $result = $courseSection->students()->syncWithoutDetaching([$studentId]);
            if (!$result)
                return false;
            return true;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
