<?php

namespace App\Http\Requests\CourseOffer;

use App\Http\Requests\BaseRequest;

class CourseOfferGradeRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'course_offer_id' => 'min:1|exists:course_offers,id|integer'
        ];
    }
}
