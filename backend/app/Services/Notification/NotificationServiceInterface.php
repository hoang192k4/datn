<?php

namespace App\Services\Notification;

use Illuminate\Http\Request;

interface NotificationServiceInterface
{
    public function sendNotificationToStudents(Request $request);
}
