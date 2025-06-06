<?php

namespace App\Http\Resources\Student;

use App\Http\Resources\Grade\GradeResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Collection;

class StudentGradeResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'grades' => $this->grades
                ->groupBy('grade_type_id')
                ->map(function (Collection $grades) {
                    return $grades
                        ->sortBy('attempt')
                        ->values()
                        ->map(fn($grade) => new GradeResource($grade));
                })
                ->toArray(),
        ];
    }
}
