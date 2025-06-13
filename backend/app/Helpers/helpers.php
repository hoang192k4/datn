<?php

use Carbon\Carbon;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;

if (!function_exists('format_datetime')) {
    function format_datetime($datetime, $format = 'd-m-Y H:i')
    {
        return Carbon::parse($datetime)->format($format);
    }
}


if (!function_exists('format_date')) {
    function format_date($datetime, $format = 'd-m-Y')
    {
        return Carbon::parse($datetime)->format($format);
    }
}

if (!function_exists('generate_slug')) {
    function generate_slug($string)
    {
        return Str::slug($string, '-');
    }
}


if (!function_exists('getCurrentGuard')) {
    function getCurrentGuard()
    {
        foreach (array_keys(config('auth.guards')) as $guard) {
            if (Auth::guard($guard)->check()) {
                return $guard;
            }
        }
        throw new AuthenticationException('Xác thực không thành công');
    }
}


if (!function_exists('getCurrentUser')) {
    function getCurrentUser()
    {
        foreach (array_keys(config('auth.guards')) as $guard) {
            if (Auth::guard($guard)->check()) {
                return Auth::guard($guard)->user();
            }
        }
        throw new AuthenticationException('Xác thực không thành công');
    }
}


if (!function_exists('getCurrentUserId')) {
    function getCurrentUserId()
    {
        foreach (array_keys(config('auth.guards')) as $guard) {
            if (Auth::guard($guard)->check()) {
                return Auth::guard($guard)->id();
            }
        }
        throw new AuthenticationException('Xác thực không thành công');
    }
}

