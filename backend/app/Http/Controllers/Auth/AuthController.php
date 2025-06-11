<?php

namespace App\Http\Controllers\Auth;

use Carbon\Carbon;
use App\Models\Student;
use Illuminate\Http\Request;
use App\Traits\AuthstudentApi;
use App\Services\AuthServiceApi;
use App\Supports\ResponseWithJson;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use App\Http\Controllers\BaseController;
use App\Http\Resources\Student\StudentResource;
use App\Http\Resources\Teacher\TeacherResource;
use App\Traits\AuthTeacherApi;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;

/**
 * @group Tài khoản giảng viên
 */
class AuthController extends BaseController
{
    use AuthstudentApi, ResponseWithJson, AuthTeacherApi;
    public function __construct() {}

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
}
