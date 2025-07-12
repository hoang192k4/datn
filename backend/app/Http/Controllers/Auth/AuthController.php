<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Traits\AuthStudentApi;
use App\Traits\AuthTeacherApi;
use App\Services\AuthServiceApi;
use App\Supports\ResponseWithJson;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\BaseController;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Resources\Student\StudentResource;
use App\Http\Resources\Teacher\TeacherResource;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

/**
 * @group Tài khoản giảng viên
 */
class AuthController extends BaseController
{
    use AuthStudentApi, ResponseWithJson, AuthTeacherApi;
    public function __construct()
    {
        $this->middleware('auth:teacher,student')->except('refresh');
    }

    public function me()
    {
        if (auth('teacher')->check()) {
            return $this->jsonResponseSuccess(new TeacherResource($this->getCurrentTeacher()));
        }

        if (auth('student')->check()) {
            return $this->jsonResponseSuccess(new StudentResource($this->getCurrentStudent()));
        }

        return $this->jsonResponseError('Xác thực không thành công', 401);
    }
    public function refresh(Request $request)
    {
        $guards = ['teacher', 'student'];
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return $this->jsonResponseError('Không có refresh token', 401);
        }

        foreach ($guards as $guard) {
            Auth::shouldUse($guard);

            try {
                // Kiểm tra token hiện tại
                JWTAuth::setToken($refreshToken);
                $payload = JWTAuth::getPayload();

                if ($payload->get('type') !== 'refresh') {
                    continue;
                }

                $userId = $payload->get('sub');
                $user = Auth::guard($guard)->getProvider()->retrieveById($userId);

                if (!$user) {
                    continue;
                }

                // Tạo access token mới
                $newAccessToken = Auth::guard($guard)->tokenById($userId);
                return $this->respondWithAccessToken($newAccessToken, $user, $guard);
            } catch (TokenExpiredException $e) {
                continue;
            } catch (TokenInvalidException $e) {
                continue;
            } catch (JWTException $e) {
                continue;
            }
        }

        return $this->jsonResponseError('Không thể refresh token', 401);
    }

    protected function respondWithTokens($accessToken, $user, $guard)
    {
        $secure = config('session.secure');
        $accessTtl = (int)config('jwt.ttl'); // phút
        $refreshTtl = (int)config('jwt.refresh_ttl'); // phút
        $userId = $user->id;

        $refreshToken = Auth::guard($guard)
            ->claims(['type' => 'refresh'])
            ->setTTL($refreshTtl)
            ->tokenById($userId);

        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => $accessTtl,
            'expires_at' => Carbon::now()->addMinutes($accessTtl)->toDateTimeString(),
            'user' => $user->name,
        ])
            ->cookie('access_token', $accessToken, $accessTtl * 30, null, null, $secure, true, false, 'Strict')
            ->cookie('refresh_token', $refreshToken, $refreshTtl * 30, null, null, $secure, true, false, 'Strict');
    }

     protected function respondWithAccessToken($accessToken, $user, $guard)
    {
        $secure = config('session.secure');
        $accessTtl = (int)config('jwt.ttl'); // phút

        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => $accessTtl,
            'expires_at' => Carbon::now()->addMinutes($accessTtl)->toDateTimeString(),
            'user' => $user->name,
        ])
            ->cookie('access_token', $accessToken, $accessTtl * 30, null, null, $secure, true, false, 'Strict');
    }
}
