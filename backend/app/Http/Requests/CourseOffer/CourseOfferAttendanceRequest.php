<?php

namespace App\Http\Requests\CourseOffer;

use App\Http\Requests\BaseRequest;

class CourseOfferAttendanceRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'date' => 'required|date',
            'course_offer_id' => 'required|min:1|exists:course_offers,id|integer',
            'attendance' => 'required'
        ];
    }
}
