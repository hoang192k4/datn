<?php

namespace App\Http\Controllers\Subject;

use Illuminate\Http\Request;
use App\Traits\AuthTeacherApi;
use App\Http\Controllers\BaseController;
use App\Http\Requests\DocumentSubject\SubjectRequest;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Subject\SubjectDetailResource;
use App\Http\Resources\Subject\SubjectResource;
use App\Http\Resources\Subject\SubjectResourceCollection;
use App\Http\Resources\Subject\SubjectSearchResource;
use App\Repositories\Subject\SubjectRepositoryInterface;
use App\Services\Subject\SubjectServiceInterface;
use Exception;

class SubjectController extends BaseController
{
    use AuthTeacherApi;
    public function __construct(SubjectRepositoryInterface $repository, SubjectServiceInterface $service)
    {
        $this->repository = $repository;
        $this->service = $service;
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin')->only('getListSubjects');
    }


    public function getSubjectByTeacherId()
    {
        try {
            $teacher = $this->getCurrentTeacher();
            $subjects = $teacher->subjects;
            return $this->jsonResponseSuccess(SubjectResource::collection($subjects));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function getDetailDocumentBySubjectId(SubjectRequest $request)
    {
        try {
            $data = $request->validated();
            $subject = $this->repository->find($data['subject_id']);
            $teacherId = $this->getCurrentTeacherId();
            if ($subject->teachers()->first()->id !== $teacherId) {
                return $this->jsonResponseError('Bạn không có quyền truy cập tài nguyên này', 403);
            }
            return $this->jsonResponseSuccess(new SubjectDetailResource($subject));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function getListSubjectSearch()
    {
        try {
            $teacher = $this->getCurrentTeacher();
            $subjects = $teacher->subjects;
            return $this->jsonResponseSuccess(SubjectSearchResource::collection($subjects));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }

    public function getListSubjects(SearchRequest $request)
    {
        try {
            $subjects = $this->service->getListSubjects($request);
            if (!$subjects)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new SubjectResourceCollection($subjects));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống.', 500);
        }
    }
}
