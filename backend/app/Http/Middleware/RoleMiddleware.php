<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        $user =  $request->user();
        
        if (!$user || !in_array($user->role->name, $roles)) {
            return response()->json(['status' => 403, 'message' => 'Bạn không có quyền truy cập vào chức năng này'], 403);
        }
        return $next($request);
    }
}
