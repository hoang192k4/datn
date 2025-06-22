<?php

namespace App\Http\Controllers\CourseSection;

use App\Enums\Student\StudentStatus;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseRequest;
use App\Http\Resources\CourseSection\CourseSectionResourceCollection;
use App\Http\Resources\Student\StudentResource;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Services\CourseSection\CourseSectionServiceInterface;
use Exception;

class CourseSectionController extends BaseController
{
    public function __construct(
        CourseSectionServiceInterface $service,
        CourseSectionRepositoryInterface $repository
    ) {
        $this->service = $service;
        $this->repository = $repository;
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

    public function getStudentsByCourseSection(string $courseSectionId)
    {
        $listStudent = $this->repository->find($courseSectionId)->students->where('status', StudentStatus::Active)->values();
        $studentJson = $listStudent->map(function ($item) {
            return new StudentResource($item);
        });
        return $this->jsonResponseSuccess($studentJson);
    }
}
