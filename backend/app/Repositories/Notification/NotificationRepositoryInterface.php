<?php

namespace App\Repositories\Notification;

use App\Repositories\EloquentRepositoryInterface;

interface NotificationRepositoryInterface extends EloquentRepositoryInterface
{
    public function getMyTeacherNotificationSendStudent($teacherId, $page, $limit, $key);
}
