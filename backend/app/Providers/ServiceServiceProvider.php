<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    protected array $services = [
        'App\Services\SummaryGrade\SummaryGradeServiceInterface' => 'App\Services\SummaryGrade\SummaryGradeService',
        'App\Services\Calculate\CalculateServiceInterface' => 'App\Services\Calculate\CalculateService',
        'App\Services\CourseSection\CourseSectionServiceInter' => 'App\Services\CourseSection\CourseSectionService',
        'App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface' => 'App\Services\CourseSectionAttendance\CourseSectionAttendanceService',
        'App\Services\Grade\GradeServiceInterface' => 'App\Services\Grade\GradeService',
        'App\Services\CourseSectionGrade\CourseSectionGradeServiceInterface' => 'App\Services\CourseSectionGrade\CourseSectionGradeService',
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
