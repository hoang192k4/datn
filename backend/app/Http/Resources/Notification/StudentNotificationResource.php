<?php

namespace App\Http\Resources\Notification;

use App\Http\Resources\Student\StudentNotifyResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentNotificationResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'created_at' => format_datetime($this->created_at),
            'sender' => $this->teacher->name ?? $this->student->name,
            'from' => $this->teacher->role->title ?? 'student',
            'student' => new StudentNotifyResource($this->student),
        ];
    }
}
