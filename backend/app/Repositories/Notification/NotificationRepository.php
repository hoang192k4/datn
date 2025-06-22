<?php

namespace App\Repositories\Notification;

use App\Enums\Notification\NotificationType;
use App\Models\Notification;
use App\Repositories\EloquentRepository;

class NotificationRepository extends EloquentRepository implements NotificationRepositoryInterface
{
    public function getModel()
    {
        return Notification::class;
    }

    public function getMyTeacherNotificationSendStudent($teacherId, $page, $limit, $key, $status)
    {
        $query = $this->model->where('teacher_id', $teacherId)->where('type', NotificationType::TeacherSend)->where('post_id', 0);
        if ($status) {
            $query->where('status', $status);
        }
        if ($key) {
            $query->where(function ($query) use ($key) {
                $query->where('title', 'like', '%' . $key . '%')->orWhere('content', 'like', '%' . $key . '%');
            });
        }
        return $query->orderBy('created_at', 'desc')->orderBy('id', 'desc')->paginate($limit, ['*'], 'page', $page);
    }
}
