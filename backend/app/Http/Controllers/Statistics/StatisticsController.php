<?php

namespace App\Http\Controllers\Statistics;

use App\Enums\CourseSection\CourseSectionStatus;
use App\Enums\Role;
use App\Enums\Student\StudentStatus;
use App\Enums\Teacher\TeacherStatus;
use App\Http\Controllers\BaseController;
use App\Http\Resources\Statistics\AdminStatisticResource;
use App\Http\Resources\Statistics\TeacherStatisticResource;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\Post\PostRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Traits\AuthTeacherApi;
use Exception;
use Illuminate\Http\Request;

class StatisticsController extends BaseController
{
    use AuthTeacherApi;
    protected $studentRepository;
    protected $teacherRepository;
    protected $courseSectionRepository;
    protected $postRepository;

    public function __construct(
        StudentRepositoryInterface $studentRepository,
        TeacherRepositoryInterface $teacherRepository,
        CourseSectionRepositoryInterface $courseSectionRepository,
        PostRepositoryInterface $postRepository,
    ) {
        $this->studentRepository = $studentRepository;
        $this->teacherRepository = $teacherRepository;
        $this->courseSectionRepository = $courseSectionRepository;
        $this->postRepository = $postRepository;
    }

    public function statistics(Request $request)
    {
        try {

            $role = $request->get('role');
            if ($role == Role::DEPARTMENT_ADMIN || $role == Role::FACULTY_ADMIN) {
                $statisticsAdmin = $this->getStatisticAdmin();
                return $this->jsonResponseSuccess(new AdminStatisticResource($statisticsAdmin));
            }

            if ($role == Role::HOMEROOM_TEACHER || $role == Role::SUBJECT_TEACHER) {
                $statisticsAdmin = $this->getStatisticTeacher();
                return $this->jsonResponseSuccess(new TeacherStatisticResource($statisticsAdmin));
            }
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    protected function getStatisticAdmin()
    {
        $countStudents = $this->studentRepository->countWithConditions(['status' => StudentStatus::Active]);
        $countTeachers = $this->teacherRepository->countWithConditions(['status' => TeacherStatus::Active]);
        $countCourseSections = $this->courseSectionRepository->countWithConditions(['status' => CourseSectionStatus::InProgress]);

        $statistics = (object)[
            'totalStudents' => $countStudents,
            'totalTeachers' => $countTeachers,
            'totalCourseSections' => $countCourseSections
        ];
        return $statistics;
    }


    protected function getStatisticTeacher()
    {
        $currentTeacherId = $this->getCurrentTeacherId();
        // $countStudents = $this->studentRepository->countWithConditions(['status' => StudentStatus::Active]);
        // $countTeachers = $this->teacherRepository->countWithConditions(['status' => TeacherStatus::Active]);
        $countCourseSections = $this->courseSectionRepository->countWithConditions(['status' => CourseSectionStatus::InProgress, 'teacher_id' => $currentTeacherId]);

        $countPosts = $this->postRepository->countWithConditions(['teacher_id' => $currentTeacherId]);
        $statistics = (object)[
            // 'totalStudents' => $countStudents,
            // 'totalTeachers' => $countTeachers,
            'totalCourseSections' => $countCourseSections,
            'totalPosts' => $countPosts,
        ];
        return $statistics;
    }
}
