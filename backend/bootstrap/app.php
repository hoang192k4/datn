<?php

use App\Http\Middleware\ApiKeyMiddleware;
use App\Http\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Route;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Container\Attributes\Auth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('api')
                ->prefix('api/v1')
                ->name('api.')
                ->group(base_path('routes/api/v1.php'));
        }
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->api(prepend: [ApiKeyMiddleware::class]);
        $middleware->alias(['auth' => Authenticate::class]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->render(function (TokenInvalidException $e, Request $request) {
            return response()->json(['message' => 'Token không hợp lệ'], 401);
        });

        $exceptions->render(function (TokenExpiredException $e, Request $request) {
            return response()->json(['message' => 'Token đã hết hạn'], 401);
        });

        $exceptions->render(function (JWTException $e, Request $request) {
            return response()->json(['message' => 'Không tìm thấy token'], 401);
        });
    })
    ->create();
