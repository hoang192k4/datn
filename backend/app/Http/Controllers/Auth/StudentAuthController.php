<?php

namespace App\Http\Controllers\Auth;

use App\Enums\Student\StudentStatus;
use Carbon\Carbon;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Traits\AuthStudentApi;
use App\Services\AuthServiceApi;
use App\Supports\ResponseWithJson;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\BaseController;
use App\Http\Resources\Student\StudentResource;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

/**
 * @group Tài khoản giảng viên
 */
class StudentAuthController extends BaseController
{
    use AuthStudentApi, ResponseWithJson;
    protected $secure;
    public function __construct()
    {
        $this->middleware('auth:student')->except(['login', 'register', 'refresh']);
        $this->secure = config('session.secure');
    }

    /**
     * Đăng nhập dành cho giảng viên
     *
     * @header X-API-KEY string required Khóa API để xác thực. Example: x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs
     * @bodyParam email string required Email của người dùng. Example: meta@example.com
     * @bodyParam password string required Mật khẩu của người dùng. Example: secret
     *
     * @response 200 {
     *  "access_token": "eyJ0eXAiOi
     * JhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ik1ldGEiLCJpYXQiOjE2MTYwMjYyMDAsImV4cCI6MTYxNjAyOTgwMH0.3z8b
     * ",
     * "token_type": "bearer",
     * "expires_in": 3600,
     * "expires_at": "2021-03-01 12:00:00"
     * }
     * @response 401 {
     * "error": "Unauthorized"
     * }
     * @response 400 {
     * "error": "Invalid credentials"
     * }
     * @response 500 {
     * "error": "Internal Server Error"
     * }
     *
     */
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = Auth::guard('student')->attempt($credentials)) {
            return response()->json(['error' => 'Xác thực không thành công'], 401);
        }

        $user = Auth::guard('student')->user();

        if ($user->status !== StudentStatus::Active) {
            $status = StudentStatus::getDesciptionStatus($user->status);
            return response()->json(['error' => "Sinh viên đang trong trạng thái $status, không thể đăng nhập"], 403);
        }
        $tokenWithGuard = JWTAuth::claims(['guard' => 'student'])->fromUser($user);
        return $this->respondWithTokens($tokenWithGuard, $user);
    }

    /**
     * Làm mới token đăng nhập
     *
     * @authenticated
     * @header X-API-KEY string required Khóa API để xác thực. Example: x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs
     * @response 200 {
     * "access_token": "eyJ0eXAiOiJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6Ik1ldGEiLCJpYXQiOjE2MTYwMjYyMDAsImV4cCI6MTYxNjAyOTgwMH0.3z8b",
     * "token_type": "bearer",
     * "expires_in": 3600,
     * "expires_at": "2021-03-01 12:00:00"
     * }
     * @response 401 {
     * "error": "Unauthorized"
     * }
     * @response 500 {
     * "error": "Internal Server Error"
     * }
     */
    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');
        if (!$refreshToken) {
            return $this->jsonResponseError('Không có refresh token', 401);
        }

        try {
            $payload = JWTAuth::setToken($refreshToken)->getPayload();

            if ($payload->get('type') !== 'refresh') {
                return $this->jsonResponseError('refresh token không hợp lệ', 401);
            }
            $userId = $payload->get('sub');
            $user = Student::find($userId);

            if (!$user) {
                return $this->jsonResponseError('Không tìm thấy người dùng', 404);
            }

            $newAccessToken = Auth::guard('student')->tokenById($userId);
            return $this->respondWithAccessToken($newAccessToken, $user);
        } catch (TokenExpiredException $e) {
            return response()->json(['status' => 401, 'message' => 'Refresh token hết hạn']);
        } catch (JWTException $e) {
            return $this->jsonResponseError('refresh token không hợp lệ', 401);
        }
    }

    /**
     * Đăng xuất người dùng
     *
     * @authenticated
     * @header X-API-KEY string required Khóa API để xác thực. Example: x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs
     * @response 200 {
     * "message": "Successfully logged out"
     * }
     * @response 401 {
     * "error": "Unauthorized"
     * }
     * @response 500 {
     * "error": "Internal Server Error"
     * }
     */
    public function logout()
    {
        Auth::guard('student')->logout();
        return response()->json(['status' => 200, 'message' => 'Logged out'])
            ->withCookie(Cookie::forget('access_token'))
            ->withCookie(Cookie::forget('refresh_token'));
    }


    /**
     * Lấy thông tin người dùng hiện tại
     *
     * @authenticated
     * @header X-API-KEY string required Khóa API để xác thực. Example: x8Yz0ABRLa9cP7KYJ1TFojZUDqk4MPsxhNQvVGAs
     * @response 200 {
     * "id": 1,
     * "name": "Meta",
     * "email": "meta@example.com"
     * }
     * @response 401 {
     * "error": "Unauthorized"
     * }
     * @response 500 {
     * "error": "Internal Server Error"
     * }
     */
    public function me()
    {
        return $this->jsonResponseSuccess(new StudentResource($this->getCurrentstudent()));
    }


    protected function respondWithTokens($accessToken, $user)
    {
        $accessTtl = (int)config('jwt.ttl'); // phút
        $refreshTtl = (int)config('jwt.refresh_ttl'); // phút
        $userId = $user->id;

        $refreshToken = Auth::guard('student')
            ->claims(['type' => 'refresh'])
            ->setTTL($refreshTtl)
            ->tokenById($userId);

        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => $accessTtl,
            'expires_at' => Carbon::now()->addMinutes($accessTtl)->toDateTimeString(),
            'user' => new StudentResource($user),
        ])
            ->cookie('access_token', $accessToken, $accessTtl * 30, null, null, $this->secure, true, false, 'Strict')
            ->cookie('refresh_token', $refreshToken, $refreshTtl * 30, null, null, $this->secure, true, false, 'Strict');
    }

    protected function respondWithAccessToken($accessToken, $user)
    {
        $accessTtl = (int)config('jwt.ttl'); // phút

        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => $accessTtl,
            'expires_at' => Carbon::now()->addMinutes($accessTtl)->toDateTimeString(),
            'user' => new StudentResource($user),
        ])
            ->cookie('access_token', $accessToken, $accessTtl * 30, null, null, $this->secure, true, false, 'Strict');
    }
}
