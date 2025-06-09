<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    protected array $repositories = [
        'App\Repositories\Student\StudentRepositoryInterface' => 'App\Repositories\Student\StudentRepository',
        'App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface' =>  'App\Repositories\SummaryGrade\SummaryGradeRepository',
        'App\Repositories\Grade\GradeRepositoryInterface' => 'App\Repositories\Grade\GradeRepository',
        'App\Repositories\EloquentRepositoryInterface' => 'App\Repositories\EloquentRepository',
        'App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface' => 'App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepository',
        'App\Repositories\CourseSectionGrade\CourseSectionGradeRepositoryInterface' => 'App\Repositories\CourseSectionGrade\CourseSectionGradeRepository',
    ];
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
        foreach ($this->repositories as $interface => $implementation) {
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
