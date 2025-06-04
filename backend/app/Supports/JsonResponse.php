<?php

namespace App\Supports;

use Illuminate\Http\JsonResponse as HttpJsonResponse;

trait JsonResponse
{

    /**
     * Return a standard success json response
     * @param mixed $data
     * @param string $message
     * @param int $tatus
     *
     * @return JsonResponse
     */
    protected function jsonResponseSuccess(mixed $data, string $message = '', int $status = 200): HttpJsonResponse
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
    protected function jsonResponseSuccessNoData(string $message = '', int $status = 200): HttpJsonResponse
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
    protected function jsonResponseError(string $message = '', int $status = 400): HttpJsonResponse
    {
        return response()->json([
            'status' => $status,
            'message' => $message ?: 'Thực hiện không thành công'
        ], $status);
    }

}
