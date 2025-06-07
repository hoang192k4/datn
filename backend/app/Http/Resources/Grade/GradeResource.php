<?php

namespace App\Http\Resources\Grade;

use App\Http\Resources\GradeType\GradeTypeResource;
use App\Http\Resources\Student\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'score' => $this->score,
            'score_visibility' => $this->score_visibility,
            'attempt' => $this->attempt,
            'grade_type' => new GradeTypeResource($this->grade_type),

        ];
    }
}
