<?php

namespace App\Http\Resources\Post;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'course_section' => ['id' => $this->course_section->id, 'name' => $this->course_section->name],
            'teacher' => $this->teacher->name,
            'created_at' => format_datetime($this->created_at, 'H:i d-m-Y'),
            'status' => $this->status,
        ];
    }
}
