<?php

namespace App\Services\CourseSectionAttendance;

use Exception;
use App\Supports\Log;
use App\Models\Session;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\CourseSection;
use App\Traits\AuthTeacherApi;
use Illuminate\Support\Facades\DB;
use App\Enums\Student\StudentStatus;
use App\Services\Calculate\CalculateServiceInterface;
use App\Repositories\Session\SessionRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;

class CourseSectionAttendanceService implements CourseSectionAttendanceServiceInterface
{
    use Log, AuthTeacherApi;
    protected $repository;
    protected $sessionRepository;
    protected $calculateService;
    protected $summaryGradeService;
    protected $studentRepository;
    public function __construct(
        CourseSectionAttendanceRepositoryInterface $repository,
        SessionRepositoryInterface $sessionRepository,
        CalculateServiceInterface $calculateService,
        StudentRepositoryInterface $studentRepository,
        SummaryGradeServiceInterface $summaryGradeService
    ) {
        $this->repository = $repository;
        $this->sessionRepository = $sessionRepository;
        $this->calculateService = $calculateService;
        $this->studentRepository = $studentRepository;
        $this->summaryGradeService = $summaryGradeService;
    }

    public function storeAttendanceStudents(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $sessionId = $data['session_id'];
            $attendanceStudents = $data['attendance'];
            if ($sessionId == null)
                return false;
            DB::commit();
            $result =  $this->repository->storeAndUpdateAttendanceStudents($sessionId, $attendanceStudents);
            if (!$result)
                return false;
            $courseSectionId = $this->sessionRepository->find($sessionId)->schedule->course_section_id;
            $students = collect($attendanceStudents)->map(function ($attendance) {
                return   $attendance['student_id'];
            })->toArray();
            foreach ($students as $student) {
                $this->attendanceScore($student, $courseSectionId);
            }
            return $result;
        } catch (\Exception $e) {
            $this->logError($e->getMessage(), $e);
            Db::rollBack();
            return false;
        }
    }

    public function getAllAttendanceByCourseSection(string $courseSectionId)
    {
        DB::beginTransaction();
        try {
            $studentData = [];
            $courseSection = $this->repository->getAllAttendanceByCourseSection($courseSectionId);
            if ($courseSection) {
                foreach ($courseSection->schedules as $schedule) {
                    foreach ($schedule->sessions as $session) {
                        foreach ($session->attendances as $attendance) {
                            if ($attendance->student->status !== StudentStatus::Active)
                                continue;

                            $studentAttendance = $this->repository->totalAttendanceStudentByCourseSection($attendance->student->id, $courseSectionId);
                            $totalSessionAttendance = $this->repository->totalSessionByCourseSection($courseSectionId);

                            $studentId = $attendance->student->id;
                            $studentName = $attendance->student->name;
                            $studentCode = $attendance->student->student_code;
                            $sessionId = $session->id;

                            $studentData[$studentId]['id'] = $studentId;
                            $studentData[$studentId]['name'] = $studentName;
                            $studentData[$studentId]['student_code'] = $studentCode;
                            $studentData[$studentId]['attendance_score'] = $studentAttendance . "/" . $totalSessionAttendance;
                            $studentData[$studentId]['attendance'][] = [
                                'session_id' => $sessionId,
                                'session_date' => $session->study_date,
                                'status' => $attendance->status,
                                'note' => $attendance->note,
                            ];
                        }
                    }
                }
                foreach ($studentData as &$student) {
                    if (isset($student['attendance'])) {
                        usort($student['attendance'], function ($a, $b) {
                            return strtotime($a['session_date']) <=> strtotime($b['session_date']);
                        });
                    }
                }
                unset($student);
                DB::commit();
                return  $studentData;
            }
        } catch (\Exception $e) {
            DB::rollBack();
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function getSessionsByCourseSection(Request $request)
    {
        $data = $request->validated();
        $courseSectionId = $data['course_section_id'];
        $result = $this->repository->find($courseSectionId);
        if (!$result)
            return false;
        return $result;
    }

    public function getAttendancesBySession(Request $request)
    {
        $data = $request->validated();
        $sessionId = $data['session_id'];
        $session = $this->sessionRepository->find($sessionId);
        if (!$session)
            return false;
        return $session;
    }

    public function attendanceScore($studentId, $courseSectionId)
    {
        $attendanceScore = $this->calculateService->calculateAttendanceScore($studentId, $courseSectionId);
        $isUpdateGrade = $this->summaryGradeService->updateAttendanceSore($courseSectionId, $studentId, $attendanceScore);
        if (!$isUpdateGrade)
            return false;
        return true;
    }

    public function getFileNameExportAttendance($sessionId)
    {
        $session = $this->sessionRepository->find($sessionId);
        $studyDate = $session->study_date;
        $courseSectionName = $session->schedule->course_section->name;
        $handleCourseName = Str::slug($courseSectionName, '_');
        return "diem_danh_lop_" . $handleCourseName . "_" . $studyDate . ".xlsx";
    }
}
