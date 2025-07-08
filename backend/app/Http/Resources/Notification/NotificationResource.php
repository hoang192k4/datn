<?php

namespace App\Http\Resources\Notification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NotificationResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'created_at' => format_datetime($this->created_at, 'H:i d-m-Y'),
            'sender' => $this->teacher->name ?? $this->student->name,
            'from' => $this->teacher->role->title ?? 'Sinh viên',
            'student' => $this->student,
        ];
    }
}
