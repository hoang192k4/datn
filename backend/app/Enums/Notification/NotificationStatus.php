<?php

namespace App\Enums\Notification;

enum NotificationStatus: string
{
    case Read = 'read';
    case Unread = 'unread';
}
