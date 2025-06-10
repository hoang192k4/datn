<?php

namespace App\Http\Controllers\DeviceToken;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\BaseController;

class DeviceTokenController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth:teacher,student');
    }

    public function update(Request $request)
    {
        $request->validate([
            'device_token' => 'required|string',
        ]);

        $deviceToken = $request['device_token'];
        if (Auth::guard('student')->check()) {
            $user = Auth::guard('student')->user();
            $user->device_token = $deviceToken;
            $user->save();
            return $this->jsonResponseSuccessNoData('Cập nhật device token thành công cho sinh viên');
        } elseif (Auth::guard('teacher')->check()) {
            $user = Auth::guard('teacher')->user();
            $user->device_token = $deviceToken;
            $user->save();
            return $this->jsonResponseSuccessNoData('Cập nhật device token thành công cho giảng viên');
        }

        return $this->jsonResponseError('Xác thực không thành công', 401);
    }
}
