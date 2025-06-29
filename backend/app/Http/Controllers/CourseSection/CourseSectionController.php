<?php

namespace App\Http\Controllers\CourseSection;

use App\Enums\Student\StudentStatus;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseRequest;
use App\Http\Requests\CourseSection\CourseSectionFilterRequest;
use App\Http\Requests\CourseSection\CourseSectionRequest;
use App\Http\Requests\CourseSection\CourseSectionStudentRequest;
use App\Http\Resources\CourseSection\CourseSectionResourceCollection;
use App\Http\Resources\Student\StudentResource;
use App\Models\CourseSection;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Services\CourseSection\CourseSectionServiceInterface;
use Exception;
use Illuminate\Validation\ValidationException;

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
        try {
            $listStudent = $this->repository->find($courseSectionId)->students->where('status', StudentStatus::Active)->values();
            $studentJson = $listStudent->map(function ($item) {
                return new StudentResource($item);
            });
            return $this->jsonResponseSuccess($studentJson);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function detachStudentByCourseSection(CourseSectionStudentRequest $request)
    {
        try {
            $result = $this->service->detachStudentByCourseSection($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Xóa sinh viên khỏi lớp học phần thành công!');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function attachStudentByCourseSection(CourseSectionStudentRequest $request)
    {
        try {
            $result = $this->service->attachStudentByCourseSection($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Thêm sinh viên vào lớp học phần thành công!');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function create(CourseSectionRequest $request)
    {
        try {
            $result = $this->service->create($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function update(CourseSectionRequest $request, $courseSectionId)
    {
        try {
            $result = $this->service->update($request, $courseSectionId);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate("Thực hiện không thành công", 400, $e->errors());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function updateStatus(CourseSectionRequest $request, $courseSectionId)
    {
        try {
            $result = $this->service->updateStatus($request, $courseSectionId);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getCourseSectionByFilter(CourseSectionFilterRequest $request)
    {
        try {
            $courseSections = $this->service->getCourseSectionByFilter($request);
            if (!$courseSections)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new CourseSectionResourceCollection($courseSections));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
