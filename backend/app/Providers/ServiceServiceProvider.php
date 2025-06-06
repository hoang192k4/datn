<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class ServiceServiceProvider extends ServiceProvider
{
    protected array $services = [
        'App\Services\Calculate\CalculateServiceInterface' => 'App\Services\Calculate\CalculateService',
        'App\Services\CourseOffer\CourseOfferServiceInter' => 'App\Services\CourseOffer\CourseOfferService',
        'App\Services\CourseOfferAttendance\CourseOfferAttendanceServiceInterface' => 'App\Services\CourseOfferAttendance\CourseOfferAttendanceService',
        'App\Services\Grade\GradeServiceInterface' => 'App\Services\Grade\GradeService',
        'App\Services\CourseOfferGrade\CourseOfferGradeServiceInterface' => 'App\Services\CourseOfferGrade\CourseOfferGradeService',
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
