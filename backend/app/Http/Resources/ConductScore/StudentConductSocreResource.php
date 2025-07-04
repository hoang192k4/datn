<?php

namespace App\Http\Resources\ConductScore;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentConductSocreResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'conduct_score' => $this->conduct_score,
            'date' => $this->date,
            'note' => $this->note,
            'student_id' => $this->student_id
        ];
    }
}
