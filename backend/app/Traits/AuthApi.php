<?php

namespace App\Traits;

use Illuminate\Support\Facades\Auth;


trait AuthApi
{
    public function getCurrentUserId()
    {
        $guard = getCurrentGuard();
        return Auth::guard($guard)->id();
    }
}
