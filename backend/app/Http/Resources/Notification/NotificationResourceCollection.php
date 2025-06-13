<?php

namespace App\Http\Resources\Notification;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class NotificationResourceCollection extends ResourceCollection
{
    public function toArray(Request $request)
    {
        return [
            'notifications' => $this->collection->map(function ($item) {
                return new NotificationResource($item);
            }),
            'links' => [
                'first' => $this->url(1),
                'last' => $this->url($this->lastPage()),
                'prev' => $this->previousPageUrl(),
                'next' => $this->nextPageUrl(),
            ],
            'meta' => [
                'current_page' => $this->currentPage(),
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
