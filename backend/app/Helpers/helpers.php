<?php

use Carbon\Carbon;

use Illuminate\Support\Str;

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

if (!function_exists('format_date_client')) {
    function format_date_client($datetime, $format = 'Y-m-d')
    {
        return Carbon::parse($datetime)->format($format);
    }
}