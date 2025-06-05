<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\BaseController;
use App\Models\Teacher;
use App\Services\AuthServiceApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

/**
 * @group Tài khoản giảng viên
 */
class TeacherAuthController extends BaseController
{
    use AuthServiceApi;
    public function __construct()
    {
        $this->middleware('auth:api')->except(['login', 'register']);
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

        if (!$token = Auth::guard('api')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = Auth::guard('api')->user();

        return $this->respondWithToken($token, $user->role->name);
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
    public function refresh()
    {
        return $this->respondWithToken(Auth::guard('api')->refresh());
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
        Auth::guard('api')->logout();
        return response()->json(['message' => 'Successfully logged out']);
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
        return response()->json(auth('api')->user());
    }


    protected function respondWithToken($token, $role)
    {
        $ttl = config('jwt.ttl'); // Get the TTL from the JWT configuration
        $expiration = Carbon::now()->addMinutes($ttl);

        $cookie = cookie(
            'token',             // Tên cookie
            $token,              // Nội dung là JWT
            60,                  // Thời gian sống (phút)
            null,
            null,
            false,                // Secure (true nếu dùng HTTPS)
            true,                // HttpOnly = true
            false,
            'Strict'             // SameSite policy (nếu cần CORS thì để 'Lax' hoặc 'None')
        );

        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => $ttl * 60,
            'expires_at' => $expiration->toDateTimeString(),
            'role' => $role
        ])->cookie($cookie);
    }
}
