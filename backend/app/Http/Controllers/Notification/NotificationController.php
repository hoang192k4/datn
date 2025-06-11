<?php

namespace App\Http\Controllers\Notification;

use Exception;
use App\Models\Notification;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationCourseSectionRequest;
use App\Services\Firebase\FirebaseService;
use App\Services\Firebase\FirebaseServiceInterface;
use App\Http\Requests\Notification\NotificationRequest;
use App\Http\Requests\Notification\NotificationTestRequest;
use App\Services\Notification\NotificationServiceInterface;
use App\Http\Requests\Notification\NotificationStudentsRequest;

class NotificationController extends BaseController
{

    protected $notificationService;
    public function __construct(
        FirebaseServiceInterface $service,
        NotificationServiceInterface $notificationService,

    ) {
        $this->service = $service;
        $this->notificationService = $notificationService;
        $this->middleware('auth:teacher');
    }

    public function sendNotification(NotificationTestRequest $request)
    {

        $data = $request->validated();
        $result =  $this->service->sendNotification($data['device_tokens'], $data['title'], $data['body'], $data['data'] ?? []);
        if ($result)
            return $this->jsonResponseSuccessNoData('Gửi thông báo thành công', 200);
        return $this->jsonResponseError('Thêm thất bại', 500);
    }

    public function sendNotifications(NotificationRequest $request)
    {
        try {
            $response = $this->notificationService->sendNotifications($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }


    public function sendNotificationToCourseSection(NotificationCourseSectionRequest $request)
    {
        try {
            $response = $this->notificationService->sendNotificationToCourseSection($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
