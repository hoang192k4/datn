<?php

namespace App\Services\CourseSectionAttendance;


use App\Models\Session;
use App\Models\CourseSection;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Services\CourseSectionAttendance\CourseSectionAttendanceServiceInterface;
use App\Repositories\CourseSectionAttendance\CourseSectionAttendanceRepositoryInterface;
use App\Supports\Log;
use App\Supports\ResponseWithJson;
use Illuminate\Support\Facades\DB;

class CourseSectionAttendanceService implements CourseSectionAttendanceServiceInterface
{
    use Log;
    protected $repository;

    public function __construct(CourseSectionAttendanceRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }

    public function storeAttendanceStudents(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $date = $data['date'];
            $courseSectionId = $data['course_section_id'];
            $attendanceStudents = $data['attendance'];
            $sessionId = Session::whereHas('schedule', function ($query) use ($courseSectionId) {
                $query->where('course_section_id', $courseSectionId);
            })->where('study_date', $date)->first()?->id;
            if ($sessionId == null)
                return false;
            return $this->repository->storeAttendanceStudents($sessionId, $attendanceStudents);
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
                            $studentId = $attendance->student->id;
                            $studentName = $attendance->student->name;

                            $studentData[$studentId]['id'] = $studentId;
                            $studentData[$studentId]['name'] = $studentName;
                            $studentData[$studentId]['attendance'][] = [
                                'sessionDate' => $session->study_date,
                                'status' => $attendance->status,
                                'note' => $attendance->note,
                            ];
                        }
                    }
                }
                DB::commit();
                return  $studentData;
            }
        } catch (\Exception $e) {
            DB::rollBack();
            return false;
        }
    }
}
