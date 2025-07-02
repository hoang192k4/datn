<?php

namespace App\Http\Controllers\Teacher;

use App\Exports\TeacherExport;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Requests\Teacher\MyTeacherRequest;
use App\Http\Requests\Teacher\TeacherExportRequest;
use App\Http\Requests\Teacher\TeacherImportRequest;
use App\Http\Requests\Teacher\TeacherRequest;
use App\Http\Resources\Teacher\TeacherResourceCollection;
use App\Imports\TeacherImport;
use App\Models\Teacher;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Services\Teacher\TeacherServiceInterface;
use App\Traits\AuthStudentApi;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Validators\ValidationException;
use Maatwebsite\Excel\Facades\Excel;

class MyTeacherController extends BaseController
{
    use AuthStudentApi;
    public function __construct(TeacherServiceInterface $serivce, TeacherRepositoryInterface $repository)
    {
        $this->service = $serivce;
        $this->repository = $repository;
        $this->middleware('auth:student');

    }

    public function getTeachersByStudentId(SearchRequest $request)
    {
        try {
            $studentId = $this->getCurrentStudentId();
            $teachers = $this->service->getTeachersByStudentId($request, $studentId);
            return $this->jsonResponseSuccess(new TeacherResourceCollection($teachers));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
