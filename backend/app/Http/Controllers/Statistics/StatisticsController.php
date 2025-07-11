<?php

namespace App\Http\Controllers\Statistics;

use App\Enums\CourseSection\CourseSectionStatus;
use App\Enums\Student\StudentStatus;
use App\Enums\Teacher\TeacherStatus;
use App\Http\Controllers\BaseController;
use App\Http\Resources\Statistics\AdminStatisticResource;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Traits\AuthTeacherApi;
use Exception;

class StatisticsController extends BaseController
{

    protected $studentRepository;
    protected $teacherRepository;
    protected $courseSectionRepository;
    use AuthTeacherApi;
    public function __construct(
        StudentRepositoryInterface $studentRepository,
        TeacherRepositoryInterface $teacherRepository,
        CourseSectionRepositoryInterface $courseSectionRepository
    ) {
        $this->studentRepository = $studentRepository;
        $this->teacherRepository = $teacherRepository;
        $this->courseSectionRepository = $courseSectionRepository;
    }

    public function statisticsForAdmin()
    {
        try {
            $countStudents = $this->studentRepository->countWithConditions(['status' => StudentStatus::Active]);
            $countTeachers = $this->teacherRepository->countWithConditions(['status' => TeacherStatus::Active]);
            $countCourseSections = $this->courseSectionRepository->countWithConditions(['status' => CourseSectionStatus::InProgress]);

            $statistics = (object)[
                'totalStudents' => $countStudents,
                'totalTeachers' => $countTeachers,
                'totalCourseSections' => $countCourseSections
            ];
            return $this->jsonResponseSuccess(new AdminStatisticResource($statistics));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
