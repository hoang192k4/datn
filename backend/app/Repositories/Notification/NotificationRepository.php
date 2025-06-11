<?php

namespace App\Repositories\Notification;

use App\Models\Notification;
use App\Repositories\EloquentRepository;

class NotificationRepository extends EloquentRepository implements NotificationRepositoryInterface
{
    public function getModel()
    {
        return Notification::class;
    }

    
}

