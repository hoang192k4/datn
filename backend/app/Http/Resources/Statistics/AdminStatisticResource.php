<?php
namespace App\Http\Resources\Statistics;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminStatisticResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'total_students' => $this->totalStudents,
            'total_teachers' => $this->totalTeachers,
            'total_course_sections' => $this->totalCourseSections,
        ];
    }
}
