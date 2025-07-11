<?php

namespace App\Http\Resources\Statistics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TeacherStatisticResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'total_course_sections' => $this->totalCourseSections,
            'total_posts' => $this->totalPosts,
        ];
    }
}
