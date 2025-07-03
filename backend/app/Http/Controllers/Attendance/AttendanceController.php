<?php

namespace App\Http\Controllers\Attendance;

use App\Enums\Student\StudentStatus;
use App\Exceptions\ModelNotFoundByIdException;
use App\Exports\AttendanceTemplateExport;
use App\Http\Controllers\BaseController;
use App\Http\Requests\CourseSection\CourseSectionAttendanceRequest;
use App\Http\Requests\CourseSection\CourseSectionStudentRequest;
use App\Http\Requests\File\AttendanceFileRequest;
use App\Http\Requests\Session\SessionRequest;
use App\Http\Resources\Attendance\AttendanceResource;
use App\Http\Resources\Attendance\AttendanceSessionResource;
use App\Http\Resources\Attendance\AttendanceStudentResource;
use App\Http\Resources\Attendance\CourseSectionStudentAttendanceResource;
use App\Http\Resources\Attendance\SessionAttendanceResource;
use App\Http\Resources\Student\StudentResource;
use App\Imports\AttendanceImport;
use App\Models\CourseSection;
use App\Models\Session;
use App\Models\Student;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;
use App\Services\Calculate\CalculateServiceInterface;
use App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface;
use App\Supports\ResponseWithJson;
use Exception;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class AttendanceController extends BaseController
{
    use ResponseWithJson;
    public function __construct(
        CourseSectionAttendanceServiceInterface $service,
        CourseSectionAttendanceRepositoryInterface $repository
    ) {
        $this->service = $service;
        $this->repository = $repository;
        $this->middleware('auth:teacher');
    }

    public function storeAttendanceStudents(CourseSectionAttendanceRequest $request)
    {
        try {
            $result = $this->service->storeAttendanceStudents($request);
            if (!$result)
                return $this->jsonResponseError('Thực hiện không thành công vui lòng xem lại dữ liệu');
            return $this->jsonResponseSuccess($result);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getAllAttendanceByCourseSection(string $courseSectionId)
    {
        try {
            $this->repository->findOrFailById($courseSectionId);
            $studentData = $this->service->getAllAttendanceByCourseSection($courseSectionId);
            return $this->jsonResponseSuccess(array_values($studentData));
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError("không tìm thấy lớp học phần theo id $courseSectionId", 404);
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getSessionsByCourseSection(CourseSectionAttendanceRequest $request)
    {
        try {
            $result = $this->service->getSessionsByCourseSection($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new SessionAttendanceResource($result));
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getAttendancesBySession(SessionRequest $request)
    {
        try {
            $result = $this->service->getAttendancesBySession($request);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new AttendanceSessionResource($result));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }


    public function exportTemplateAttendance($sessionId)
    {
        try {
            $fileName = $this->service->getFileNameExportAttendance($sessionId);
            return Excel::download(new AttendanceTemplateExport($sessionId),  $fileName);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function importAttendances(AttendanceFileRequest $request)
    {
        try {
            Excel::import(new AttendanceImport($this->service), $request->file('file'));
            return $this->jsonResponseSuccessNoData('Đã thêm điểm danh thành công!');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Không thể nhập dữ liệu. Vui lòng kiểm tra lại các cột và nội dung', 400);
        }
    }
}
