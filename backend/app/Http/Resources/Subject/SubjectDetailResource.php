<?php

namespace App\Http\Resources\Subject;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SubjectDetailResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'subject_name' => $this->name,
            'chapters' => $this->chapters()->orderBy('position', 'asc')->get()->map(function ($chapter) {
                return [
                    'id' => $chapter->id,
                    'title' => $chapter->title,
                    'position' => $chapter->position,
                    'lectures' => $chapter->lectures()->orderBy('position','asc')->get()
                ];
            }),
        ];
    }
}
