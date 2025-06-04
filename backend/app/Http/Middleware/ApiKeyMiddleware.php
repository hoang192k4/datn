<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->header('X-API-KEY');

        // Bạn có thể so sánh hardcode, config, hoặc DB
        $validKey = config('services.api.key'); // ví dụ đọc từ config
        if ($apiKey !== $validKey) {
            return response()->json(['message' => 'Bạn không có quyền truy cập hệ thống!'], 401);
        }

        return $next($request);
    }
}
