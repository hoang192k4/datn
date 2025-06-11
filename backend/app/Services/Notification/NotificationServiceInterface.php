<?php

namespace App\Services\Notification;

use Illuminate\Http\Request;

interface NotificationServiceInterface
{
    public function sendNotificationToStudents(string $title, string $body, array $student_ids, string $type);
    public function sendNotifications(Request $request);
    public function sendNotificationToCourseSection(Request $request);
}
