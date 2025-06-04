<?php

namespace App\Services;


trait AuthServiceApi
{
    public function getCurrentUser()
    {
        // Assuming you have a method to get the authenticated user
        return auth('api')->user();
    }

    public function getCurrentUserId()
    {
        // Assuming you have a method to get the authenticated user ID
        return auth('api')->id();
    }
}
