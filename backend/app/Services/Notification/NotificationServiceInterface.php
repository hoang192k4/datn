<?php

namespace App\Services\Notification;

use Illuminate\Http\Request;

interface NotificationServiceInterface
{
    public function sendNotificationToStudents(string $title, string $body, array $student_ids, string $type, $isPost);
    public function sendNotifications(Request $request);
    public function sendNotificationToCourseSection(Request $request);
    public function sendNotificationToAll(string $title, string $body, string $type);
    public function sendNotificationToAllTeacher($teacherSendId, string $title, string $body, string $type);
    public function sendNotificationToAllStudent($teacherSendId, string $title, string $body, string $type);
    public function getMyNotifications(Request $request);
}
