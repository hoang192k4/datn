<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Symfony\Component\HttpFoundation\Response;
use Closure;

class Authenticate extends Middleware
{
    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            return null; // Trả về null để tránh chuyển hướng đến route login
        }
    }

    public function handle($request, Closure $next, ...$guards)
    {
        // Define routes to exclude from authentication


        // Skip authentication if the current route is in the excluded list


        try {
            if (!$user = JWTAuth::parseToken()->authenticate()) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
        } catch (TokenExpiredException $e) {
            return response()->json(['message' => 'Token đăng nhập đã hết hạn'], 401);
        } catch (TokenInvalidException $e) {
            return response()->json(['message' => 'Xác thực thông tin không thành công'], 401);
        } catch (JWTException $e) {
            return response()->json(['message' => 'Vui lòng gửi token đăng nhập'], 401);
        }

        return $next($request);
    }
}
