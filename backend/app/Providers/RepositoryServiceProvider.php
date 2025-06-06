<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    protected array $repositories = [
        'App\Repositories\Grade\GradeRepositoryInterface' => 'App\Repositories\Grade\GradeRepository',
        'App\Repositories\EloquentRepositoryInterface' => 'App\Repositories\EloquentRepository',
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
