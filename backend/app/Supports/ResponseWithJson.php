<?php

namespace App\Supports;

use Illuminate\Http\JsonResponse as HttpJsonResponse;
use Symfony\Component\HttpFoundation\JsonResponse;

trait ResponseWithJson
{

    /**
     * Return a standard success json response
     * @param mixed $data
     * @param string $message
     * @param int $tatus
     *
     * @return JsonResponse
     */
    protected function jsonResponseSuccess(mixed $data = null, string $message = '', int $status = 200): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: 'Thực hiện thành công',
            'data' => $data
        ], $status);
    }


    /**
     * Return a standard success json response no data
     * @param string $message
     * @param int $tatus
     *
     * @return JsonResponse
     */
    protected function jsonResponseSuccessNoData(string $message = '', int $status = 200): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: 'Thực hiện thành công',
        ], $status);
    }

    /**
     * Return a standard request error
     * @param string $message
     * @param int $tatus
     *
     * @return JsonResponse
     */
    protected function jsonResponseError(string $message = '', int $status = 400): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: 'Thực hiện không thành công'
        ], $status);
    }


    protected function jsonResponseErrorValidate(string $message = '', int $status = 400, array $errors = []): JsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: 'Thực hiện không thành công',
            'errors' => $errors,
        ], $status);
    }
}
