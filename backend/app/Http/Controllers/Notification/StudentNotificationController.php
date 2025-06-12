<?php

namespace App\Http\Controllers\Notification;

use App\Http\Controllers\BaseController;
use App\Services\Notification\NotificationServiceInterface;


class StudentNotificationController extends BaseController
{
    public function __construct(
        NotificationServiceInterface $notificationService,

    ) {
        $this->service = $notificationService;
        $this->middleware('auth:student');
    }
}
