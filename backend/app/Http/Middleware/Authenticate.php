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
        // Define routes to exclude from authentication


        // Skip authentication if the current route is in the excluded list

        if (empty($guards)) {
            $guards = [null]; // fallback về guard mặc định nếu không truyền gì
        }

        foreach ($guards as $guard) {
            try {
                Auth::shouldUse($guard);
                // Dùng JWTAuth trực tiếp để parse token và lấy user
                $user = JWTAuth::parseToken()->authenticate();
                if ($user) {
                    return $next($request);
                }
            } catch (TokenExpiredException $e) {
                return $this->jsonResponseError('Token đăng nhập đã hết hạn', 401);
            } catch (TokenInvalidException $e) {
                return $this->jsonResponseError('Token không hợp lệ', 401);
            } catch (JWTException $e) {
                return $this->jsonResponseError('Vui lòng gửi token', 401);
            } catch (\Exception $e) {
                // Xử lý fallback các lỗi ném ra khác, trong đó có AuthenticationException
                return $this->jsonResponseError('Lỗi xác thực: ' . $e->getMessage(), 401);
            }
        }

        return $this->jsonResponseError('Xác thực không thành công!', 401);
    }
}
