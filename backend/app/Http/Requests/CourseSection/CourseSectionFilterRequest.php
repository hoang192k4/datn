<?php

namespace App\Http\Requests\CourseSection;

use App\Enums\CourseSection\CourseSectionStatus;
use App\Http\Requests\BaseRequest;
use Illuminate\Validation\Rules\Enum;

class CourseSectionFilterRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'keyword' => ['string', 'nullable'],
            'status' => [new Enum(CourseSectionStatus::class), 'nullable'],
            'semester_id' => ['exists:semesters,id', 'nullable'],
            'year' => ['string', 'nullable'],
            'limit' => 'integer|min:1|nullable',
            'page' => 'integer|min:1|nullable',
        ];
    }
}
