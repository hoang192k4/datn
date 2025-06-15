<?php

namespace App\Http\Middleware;

use App\Supports\ResponseWithJson;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiKeyMiddleware
{
    use ResponseWithJson;
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
            return $this->jsonResponseError('Bạn không có quyền truy cập hệ thống!', 403);
        }

        return $next($request);
    }
}
