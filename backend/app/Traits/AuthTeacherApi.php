<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;

trait AuthTeacherApi
{
    public function getCurrentTeacher()
    {
        // Assuming you have a method to get the authenticated user
        return Auth::guard('teacher')->user();
    }

    public function getCurrentTeacherId()
    {
        // Assuming you have a method to get the authenticated user ID
        return Auth::guard('teacher')->id();
    }
}
