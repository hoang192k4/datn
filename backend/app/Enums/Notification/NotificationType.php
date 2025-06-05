<?php

namespace App\Enums\Notification;

enum NotificationType: string
{
    case StudentSend = 'student_send';
    case TeacherSend = 'teacher_send';
    case AdminSend = 'admin_send';
}
