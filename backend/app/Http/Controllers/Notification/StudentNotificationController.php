<?php

namespace App\Http\Controllers\Notification;

use Exception;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationRequest;
use App\Services\Notification\NotificationServiceInterface;


class StudentNotificationController extends BaseController
{

    public function __construct(
        NotificationServiceInterface $notificationService,

    ) {
        $this->service = $notificationService;
        $this->middleware('auth:student');
    }

    public function sendFeedbackToTeacher(NotificationRequest $request)
    {
        try {
            $response = $this->service->sendFeedbackToTeacher($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
