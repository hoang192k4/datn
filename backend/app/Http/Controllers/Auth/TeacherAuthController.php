<?php

namespace App\Http\Controllers\Auth;

use Log;
use Carbon\Carbon;
use App\Models\Teacher;
use Illuminate\Http\Request;
use App\Traits\AuthTeacherApi;
use App\Services\AuthServiceApi;
use App\Supports\ResponseWithJson;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Auth\ChangePassword;
use Tymon\JWTAuth\Exceptions\JWTException;
use App\Http\Resources\Teacher\TeacherResource;
use App\Http\Requests\Auth\ChangePasswordRequest;
use App\Http\Requests\Auth\UpdateRequest;
use Illuminate\Support\Facades\Log as LogSupport;
use App\Http\Resources\Teacher\TeacherAuthResource;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;


/**
 * @group Tài khoản giảng viên
 */
class TeacherAuthController extends BaseController
{
    use AuthTeacherApi, ResponseWithJson;
    public function __construct(TeacherRepositoryInterface $repository)
    {
        $this->middleware('auth:teacher')->except(['login', 'register', 'refresh']);
        $this->middleware('role:faculty_admin,subject_teacher')->except(['login', 'register', 'refresh']);
        $this->repository =  $repository;
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

        if (!$token = Auth::guard('teacher')->attempt($credentials)) {
            return response()->json(['error' => 'Xác thực không thành công'], 401);
        }

        $user = Auth::guard('teacher')->user();
        return $this->respondWithTokens($token, $user);
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
            $user = \App\Models\Teacher::find($userId);

            if (!$user) {
                return $this->jsonResponseError('Không tìm thấy người dùng', 404);
            }

            $newAccessToken = Auth::guard('teacher')->tokenById($userId);

            return $this->respondWithTokens($newAccessToken, $user);
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
        Auth::guard('teacher')->logout();
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
        return response()->json(new TeacherResource($this->getCurrentTeacher()));
    }


    protected function respondWithTokens($accessToken, $user)
    {
        $accessTtl = (int)config('jwt.ttl'); // phút
        $refreshTtl = (int)config('jwt.refresh_ttl'); // phút
        $userId = $user->id;

        $refreshToken = Auth::guard('teacher')
            ->claims(['type' => 'refresh'])
            ->setTTL($refreshTtl)
            ->tokenById($userId);
        $this->logInfo($userId ?? 'Không có ');
        $accessCookie = Cookie::make('access_token', $accessToken, $accessTtl, '/', null, false, true, false, 'Lax');
        $refreshCookie = Cookie::make('refresh_token', $refreshToken, $refreshTtl, '/', null, false, true, false, 'Lax');
        return response()->json([
            'access_token' => $accessToken,
            'token_type' => 'bearer',
            'expires_in' => $accessTtl,
            'expires_at' => Carbon::now()->addMinutes($accessTtl)->toDateTimeString(),
            'user' => new TeacherResource($user),
        ])
            ->withCookie($accessCookie)
            ->withCookie($refreshCookie);
    }

    public function changePassword(ChangePasswordRequest $request)
    {
        $data = $request->validated();

        $teacher = $this->getCurrentTeacher();
        if (!Hash::check($data['current_password'], $teacher->password)) {
            return $this->jsonResponseError('Mật khẩu hiện tại không đúng!', 422);
        }

        $teacher->password = Hash::make($data['new_password']);
        $teacher->save();

        return $this->jsonResponseSuccessNoData('Thay đổi mật khẩu thành công!');
    }

    public function update(UpdateRequest $request)
    {
        $data = $request->validated();
        $teacherId = $this->getCurrentTeacherId();
        if (!$teacherId) {
            return $this->jsonResponseError();
        }
        $data['slug'] = generate_slug($data['name']);
        $data['date_of_birth'] = format_date_client($data['date_of_birth']);
        $result = $this->repository->updateOrCreateById($teacherId, $data);
        if ($result)
            return $this->jsonResponseSuccessNoData('Cập nhật thông tin thành công!');
    }
}
