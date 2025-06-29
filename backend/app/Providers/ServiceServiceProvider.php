<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    protected array $services = [
        'App\Services\Schedule\ScheduleServiceInterface' => 'App\Services\Schedule\ScheduleService',
        'App\Services\Student\StudentServiceInterface' => 'App\Services\Student\StudentService',
        'App\Services\CourseSection\CourseSectionServiceInterface' => 'App\Services\CourseSection\CourseSectionService',
        'App\Services\Notification\NotificationServiceInterface' => 'App\Services\Notification\NotificationService',
        'App\Services\Firebase\FirebaseServiceInterface' => 'App\Services\Firebase\FirebaseService',
        'App\Services\SummaryGrade\SummaryGradeServiceInterface' => 'App\Services\SummaryGrade\SummaryGradeService',
        'App\Services\Calculate\CalculateServiceInterface' => 'App\Services\Calculate\CalculateService',
        'App\Services\CourseSection\CourseSectionServiceInter' => 'App\Services\CourseSection\CourseSectionService',
        'App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface' => 'App\Services\CourseSectionAttendance\CourseSectionAttendanceService',
        'App\Services\Grade\GradeServiceInterface' => 'App\Services\Grade\GradeService',
        'App\Services\CourseSectionGrade\CourseSectionGradeServiceInterface' => 'App\Services\CourseSectionGrade\CourseSectionGradeService',
        'App\Services\Post\PostServiceInterface' => 'App\Services\Post\PostService',
        'App\Services\Teacher\TeacherServiceInterface' => 'App\Services\Teacher\TeacherService',
        'App\Services\Subject\SubjectServiceInterface' => 'App\Services\Subject\SubjectService',
        'App\Services\Class\ClassServiceInterface' => 'App\Services\Class\ClassService',
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        foreach ($this->services as $interface => $implementation) {
            $this->app->bind($interface, $implementation);
        }
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
