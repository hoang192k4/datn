<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AttachAccessTokenFromCookie
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->cookie('access_token');

        if ($token) {
            // Gắn token vào Authorization header
            $request->headers->set('Authorization', 'Bearer ' . $token);
        }
        return $next($request);
    }
}
