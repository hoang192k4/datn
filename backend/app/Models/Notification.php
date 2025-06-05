<?php

namespace App\Models;

use App\Enums\Notification\NotificationStatus;
use App\Enums\Notification\NotificationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Notification extends Model
{
    //
    use HasFactory;

    protected function casts(): array
    {
        return [
            'status' => NotificationStatus::class,
            'type' => NotificationType::class,
        ];
    }
}
