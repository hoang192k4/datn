<?php

namespace App\Http\Controllers\CourseSection;

use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseRequest;
use App\Http\Resources\CourseSection\CourseSectionResourceCollection;
use App\Services\CourseSection\CourseSectionServiceInterface;
use Exception;

class CourseSectionController extends BaseController
{
    public function __construct(
        CourseSectionServiceInterface $service,
    ) {
        $this->service = $service;
        $this->middleware('auth:teacher');
    }

    public function getCourseSectionByTeacher(CourseRequest $request)
    {
        try {
            $courseSections = $this->service->getCourseSectionByTeacher($request);

            return $this->jsonResponseSuccess(new CourseSectionResourceCollection($courseSections));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
