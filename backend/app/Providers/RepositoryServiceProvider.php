<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class RepositoryServiceProvider extends ServiceProvider
{
    protected array $repositories = [
        'App\Repositories\EloquentRepositoryInterface' => 'App\Repositories\EloquentRepository',
        'App\Repositories\Product\ProductRepositoryInterface' => 'App\Repositories\Product\ProductRepository',
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
