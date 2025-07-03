<?php

namespace App\Http\Resources\Notification;

use App\Http\Resources\Teacher\TeacherResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FeedbackResource extends JsonResource
{
    public function toArray(Request $request)
    {

        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'status' => $this->status,
            'created_at' => format_datetime($this->created_at, 'H:i d-m-Y'),
            'sender' => $this->student->name,
            'from' =>  'Sinh viên',
            'teacher' => new TeacherResource($this->teacher_receive),
        ];
    }
}
