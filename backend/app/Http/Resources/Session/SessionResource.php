<?php 
namespace App\Http\Resources\Session;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SessionResource extends JsonResource
{
    public function toArray(Request $request)
    {
        return [
            'id' => $this->id,
            'study_week' => $this->study_week,
            'study_date' => $this->study_date,
            'start_time' =>$this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'schedule_id' => $this->schedule_id
        ];
    }
}