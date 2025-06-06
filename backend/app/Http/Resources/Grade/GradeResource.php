<?php

namespace App\Http\Resources\Grade;

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
            'student' => new StudentResource($this->student),
            'score_visibility' => $this->score_visibility,
        ];
    }
}
