<?php

namespace App\Http\Resources\Student;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class StudentResourceCollection extends ResourceCollection
{
    public function toArray(Request $request)
    {
        return [
            'students' => $this->collection->map(function ($item) {
                return new StudentResource($item);
            }),
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
            'meta' => [
                'previous_page' => $this->currentPage() > 1 ? $this->currentPage() - 1 : null,
                'current_page' => $this->currentPage(),
                'next_page' => $this->currentPage() < $this->lastPage() ? $this->currentPage() + 1 : null,
                'from' => $this->firstItem(),
                'to' => $this->lastItem(),
                'limit' => $this->perPage(),
                'total' => $this->total(),
                'count' => $this->count(),
                'total_pages' => $this->lastPage(),
            ],
        ];
    }
}
