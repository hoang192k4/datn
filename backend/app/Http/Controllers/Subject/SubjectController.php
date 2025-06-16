<?php

namespace App\Http\Controllers\Subject;

use Illuminate\Http\Request;
use App\Traits\AuthTeacherApi;
use App\Http\Controllers\BaseController;
use App\Http\Requests\DocumentSubject\SubjectRequest;
use App\Http\Resources\Subject\SubjectDetailResource;
use App\Http\Resources\Subject\SubjectResource;
use App\Http\Resources\Subject\SubjectSearchResource;
use App\Repositories\Subject\SubjectRepositoryInterface;

class SubjectController extends BaseController
{
    use AuthTeacherApi;
    public function __construct(SubjectRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->middleware('auth:teacher');
    }


    public function getSubjectByTeacherId()
    {
        $teacher = $this->getCurrentTeacher();
        $subjects = $teacher->subjects;
        return $this->jsonResponseSuccess(SubjectResource::collection($subjects));
    }

    public function getDetailDocumentBySubjectId(SubjectRequest $request)
    {
        $data = $request->validated();
        $subject = $this->repository->find($data['subject_id']);
        $teacherId = $this->getCurrentTeacherId();
        if ($subject->teachers()->first()->id !== $teacherId) {
            return $this->jsonResponseError('Bạn không có quyền truy cập tài nguyên này',403);
        }
        return $this->jsonResponseSuccess(new SubjectDetailResource($subject));
    }

    public function getListSubjectSearch()
    {
        $teacher = $this->getCurrentTeacher();
        $subjects = $teacher->subjects;
        return $this->jsonResponseSuccess(SubjectSearchResource::collection($subjects));
    }
}
