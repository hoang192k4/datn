<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait AuthStudentApi
{
    public function getCurrentStudent()
    {
        // Assuming you have a method to get the authenticated user
        return  Auth::guard('student')->user();
    }

    public function getCurrentStudentId()
    {
        // Assuming you have a method to get the authenticated user ID
        return Auth::guard('student')->id();
    }
}
