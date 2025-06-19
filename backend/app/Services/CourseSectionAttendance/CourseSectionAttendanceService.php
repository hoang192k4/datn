<?php

namespace App\Services\CourseSectionAttendance;

use App\Enums\Student\StudentStatus;
use App\Models\Session;
use App\Models\CourseSection;
use Illuminate\Http\Request;
use App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;
use App\Repositories\Session\SessionRepositoryInterface;
use App\Supports\Log;
use App\Traits\AuthTeacherApi;
use Exception;
use Illuminate\Support\Facades\DB;

class CourseSectionAttendanceService implements CourseSectionAttendanceServiceInterface
{
    use Log, AuthTeacherApi;
    protected $repository;
    protected $sessionRepository;

    public function __construct(CourseSectionAttendanceRepositoryInterface $repository, SessionRepositoryInterface $sessionRepository)
    {
        $this->repository = $repository;
        $this->sessionRepository = $sessionRepository;
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
            return $this->repository->storeAndUpdateAttendanceStudents($sessionId, $attendanceStudents);
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

                            $studentId = $attendance->student->id;
                            $studentName = $attendance->student->name;
                            $studentCode = $attendance->student->student_code;
                            $sessionId = $session->id;

                            $studentData[$studentId]['id'] = $studentId;
                            $studentData[$studentId]['name'] = $studentName;
                            $studentData[$studentId]['student_code'] = $studentCode;
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
        try {
            $data = $request->validated();
            $courseSectionId = $data['course_section_id'];
            $result = $this->repository->find($courseSectionId);
            if (!$result)
                return false;
            return $result;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function getAttendancesBySession(Request $request)
    {
        try {
            $data = $request->validated();
            $sessionId = $data['session_id'];
            $session = $this->sessionRepository->find($sessionId);
            if (!$session)
                return false;
            return $session;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
