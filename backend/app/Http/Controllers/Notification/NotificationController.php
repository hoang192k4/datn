<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationRequest;
use App\Http\Requests\Notification\NotificationStudentsRequest;
use App\Models\Notification;
use App\Services\Firebase\FirebaseService;
use App\Services\Firebase\FirebaseServiceInterface;
use App\Services\Notification\NotificationServiceInterface;
use Exception;

class NotificationController extends BaseController
{

    protected $notificationService;
    public function __construct(
        FirebaseServiceInterface $service,
        NotificationServiceInterface $notificationService,
    ) {
        $this->service = $service;
        $this->notificationService = $notificationService;
        $this->middleware('auth:teacher,student');
    }

    public function sendNotification(NotificationRequest $request)
    {
        $data = $request->validated();
        $result =  $this->service->sendNotification($data['device_tokens'], $data['title'], $data['body'], $data['data'] ?? []);
        if ($result)
            return $this->jsonResponseSuccessNoData('Gửi thông báo thành công', 200);
        return $this->jsonResponseError('Thêm thất bại', 500);
    }

    public function sendNotificationToStudents(NotificationStudentsRequest $request)
    {
        try {
            $response = $this->notificationService->sendNotificationToStudents($request);

        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
