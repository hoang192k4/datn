<?php

namespace App\Http\Middleware;

use App\Supports\ResponseWithJson;
use Closure;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\Middleware;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

class Authenticate
{
    use ResponseWithJson;

    protected function redirectTo($request)
    {
        if (!$request->expectsJson()) {
            return null; // Trả về null để tránh chuyển hướng đến route login
        }
    }

    public function handle($request, Closure $next, ...$guards)
    {
        if (empty($guards)) {
            $guards = [config('auth.defaults.guard')];
        }

        try {
            $token = JWTAuth::getToken();
            if (!$token) {
                return $this->jsonResponseError('Token không tồn tại', 401);
            }

            $payload = JWTAuth::setToken($token)->getPayload();
            $sub = $payload->get('sub');
            $guardFromToken = $payload->get('guard'); // bạn cần lưu guard khi tạo token
            Auth::shouldUse($guardFromToken);

            $user = Auth::authenticate();
            if (!in_array($guardFromToken, $guards)) {
                return $this->jsonResponseError('Bạn không có quyền truy cập chức năng này', 403);
            }
            if (!$user) {
                return $this->jsonResponseError('Không tìm thấy người dùng từ token', 401);
            }



            // Buộc Laravel dùng đúng guard
            Auth::shouldUse($guardFromToken);

            return $next($request);
        } catch (TokenExpiredException $e) {
            return $this->jsonResponseError('Token đã hết hạn', 401);
        } catch (TokenInvalidException $e) {
            return $this->jsonResponseError('Token không hợp lệ', 401);
        } catch (JWTException $e) {
            return $this->jsonResponseError('Lỗi xác thực token: ' . $e->getMessage(), 401);
        }
    }
}
