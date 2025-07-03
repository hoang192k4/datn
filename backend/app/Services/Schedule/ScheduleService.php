<?php

namespace App\Services\Schedule;

use App\Enums\CourseSection\CourseSectionStatus;
use App\Enums\DayOfWeek;
use App\Enums\Schedule\SessionStatus;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\Schedule\ScheduleRepositoryInterface;
use App\Repositories\Session\SessionRepositoryInterface;
use App\Supports\Log;
use App\Traits\AuthStudentApi;
use App\Traits\AuthTeacherApi;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class ScheduleService implements ScheduleServiceInterface
{
    use Log, AuthTeacherApi, AuthStudentApi;
    protected $scheduleRepository;
    protected $sessionRepository;
    protected $courseSectionRepository;
    protected $periodTimes;

    public function __construct(
        ScheduleRepositoryInterface $scheduleRepository,
        SessionRepositoryInterface $sessionRepository,
        CourseSectionRepositoryInterface $courseSectionRepository,
    ) {
        $this->scheduleRepository = $scheduleRepository;
        $this->sessionRepository = $sessionRepository;
        $this->courseSectionRepository = $courseSectionRepository;
        $this->periodTimes = config('schedule.period_times');
    }

    public function create(Request $request)
    {
        DB::beginTransaction();
        $data = $request->validated();
        $periodNumber = $data['period_number'];
        $periodStart = $data['period_start'];
        $periodEnd = $periodStart + $periodNumber - 1;
        $courseSectionId = $data['course_section_id'];
        $courseSection = $this->courseSectionRepository->find($courseSectionId);
        if ($this->checkScheduleConflict([...$data, 'start_date' => $courseSection->start_date, 'end_date' => $courseSection->end_date, 'period_end' => $periodEnd])) {
            $dayOfWeek = DayOfWeek::getDescription($data['day_of_week']);
            $startTime = $this->periodTimes[$periodStart]['start'];
            $endTime = $this->periodTimes[$periodStart]['end'];

            throw ValidationException::withMessages(['period_start' => "Phòng học đã bị trùng lịch với lớp khác trong khung giờ $dayOfWeek ($startTime - $endTime)"]);
        }

        if ($this->checkCourseSectionClassroomConflict([...$data, 'period_end' => $periodEnd])) {
            throw ValidationException::withMessages(['period_start' => 'Lớp học phần đã có lịch học vào thời gian này (có thể đã có lịch ở phòng khác)']);
        }

        if ($this->scheduleRepository->hasTeacherConflict($courseSection->teacher_id, $data['day_of_week'], $periodStart, $periodEnd, $courseSection->start_date, $courseSection->end_date)) {
            $dayOfWeek = DayOfWeek::getDescription($data['day_of_week']);
            $startTime = $this->periodTimes[$periodStart]['start'];
            $endTime = $this->periodTimes[$periodStart]['end'];

            $teacherName = optional($courseSection->teacher)->name;
            throw ValidationException::withMessages(['period_start' => "Giảng viên $teacherName đã có lịch dạy ở lớp khác vào khung giờ ($startTime - $endTime)"]);
        };


        if ($periodStart <= 6) {
            $session = SessionStatus::Morning;
        } else {
            $session = SessionStatus::Afternoon;
        }
        $schedule = $this->scheduleRepository->create([...$data, 'period_end' => $periodEnd, 'session' => $session]);

        $sessions = $this->generateSessionsFromSchedule($schedule);
        $isSessionsCreated = $this->sessionRepository->inserts($sessions);

        if (!$isSessionsCreated) {
            DB::rollBack();
            return false;
        }
        DB::commit();
        return true;
    }


    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();

            $schedule = $this->scheduleRepository->findOrFailById($id);

            if ($schedule->course_section->status !== CourseSectionStatus::InRegister) {
                $courseSectionName = $schedule->course_section->name;
                $status = CourseSectionStatus::getDescription($schedule->course_section->status);

                throw ValidationException::withMessages(["Lớp $courseSectionName $status, không thể thay đổi lịch"]);
            }

            $originalDayOfWeek = $schedule->day_of_week;
            $originalPeriodStart = $schedule->period_start;
            $originalPeriodEnd = $schedule->period_end;
            $originalCourseSectionId = $schedule->course_section_id;
            $originClassroomId = $schedule->classroom_id;

            $schedule->day_of_week = $data['day_of_week'] ?? $schedule->day_of_week;
            $schedule->period_start = $data['period_start'] ?? $schedule->period_start;
            $schedule->period_number = $data['period_number'] ?? $schedule->period_number;
            $schedule->period_end =  $schedule->period_start + $schedule->period_number - 1;
            $schedule->course_section_id = $data['course_section_id'] ?? $schedule->course_section_id;
            $schedule->classroom_id = $data['classroom_id'] ?? $schedule->classroom_id;


            if ($schedule->period_start  <= 6) {
                $schedule->session = SessionStatus::Morning;
            } else {
                $schedule->session = SessionStatus::Afternoon;
            }
            $schedule->save();

            $isSessionRelatedChanged =
                $originalDayOfWeek !== $schedule->day_of_week ||
                $originalPeriodStart !== $schedule->period_start ||
                $originalPeriodEnd !== $schedule->period_end ||
                $originalCourseSectionId !== $schedule->course_section_id ||
                $originClassroomId !== $schedule->classroom_id;

            if ($isSessionRelatedChanged) {
                if ($this->checkScheduleConflict([
                    'period_start' => $schedule->period_start,
                    'period_end' => $schedule->period_end,
                    'start_date' => $schedule->course_section->start_date,
                    'end_date' => $schedule->course_section->end_date,
                    'day_of_week' => $schedule->day_of_week->value,
                    'classroom_id' => $schedule->classroom_id,
                    'id' => $schedule->id
                ])) {
                    $dayOfWeek = DayOfWeek::getDescription($schedule->day_of_week);
                    $startTime = $this->periodTimes[$schedule->period_start]['start'];
                    $endTime = $this->periodTimes[$schedule->period_end]['end'];

                    DB::rollBack();
                    throw ValidationException::withMessages(['period_start' => "Phòng học đã bị trùng lịch với lớp khác trong khung giờ $dayOfWeek ($startTime - $endTime)"]);
                }

                if ($this->checkCourseSectionClassroomConflict([
                    'period_start' => $schedule->period_start,
                    'period_end' => $schedule->period_end,
                    'course_section_id' => $schedule->course_section_id,
                    'day_of_week' => $schedule->day_of_week->value,
                    'id' => $schedule->id,
                ])) {
                    DB::rollBack();
                    throw ValidationException::withMessages(['period_start' => 'Lớp học phần đã có lịch học vào thời gian này (có thể đã có lịch ở phòng khác)']);
                }

                // Cập nhật lại danh sách phiên học tương ứng với lịch
                $this->updateSessions($schedule);
            }
            DB::commit();
            return true;
        } catch (Throwable $e) {
            $this->logError($e->getMessage(), $e);
            DB::rollBack();
            throw $e;
        }
    }

    protected function updateSessions($schedule)
    {
        $schedule->sessions()->delete();
        $sessions = $this->generateSessionsFromSchedule($schedule);
        $isSessionsCreated = $this->sessionRepository->inserts($sessions);

        if (!$isSessionsCreated)
            return false;
        return true;
    }


    protected function getWeekDayDatesFromStart(string $startDate, int $targetWeekday, int $weeks)
    {
        $start = Carbon::parse($startDate);

        if ($start->dayOfWeek !== $targetWeekday) {
            $start->next($targetWeekday);
        }

        $dates = [];
        for ($i = 0; $i < $weeks; $i++) {
            $dates[] = $start->copy()->addWeeks($i)->format('Y-m-d');
        }
        return $dates;
    }

    protected function generateDatetime($time, $date)
    {
        return Carbon::parse("$date $time");
    }

    protected function generateSessionsFromSchedule($schedule)
    {
        $weekTotal = $schedule->course_section->week_total;
        $startDate = $schedule->course_section->start_date;
        $weekday = $schedule->day_of_week;

        $periodTime = config('schedule.period_times');
        $startTime = $periodTime[$schedule->period_start]['start'];
        $endTime = $periodTime[$schedule->period_end]['end'];

        $sessions = [];

        $dates = $this->getWeekDayDatesFromStart($startDate, $weekday->value, $weekTotal);
        foreach ($dates as $index => $date) {
            $sessions[] = [
                'study_week' => $index + 1,
                'study_date' => $date,
                'start_time' => $this->generateDatetime($startTime, $date),
                'end_time' => $this->generateDatetime($endTime, $date),
                'schedule_id' => $schedule->id,
            ];
        }

        return $sessions;
    }


    public function checkScheduleConflict(array $data): bool
    {
        $periodStart = $data['period_start'];
        $periodEnd = $data['period_end'];
        $startDate = $data['start_date'];
        $endDate = $data['end_date'];

        $isConflict = $this->scheduleRepository->hasConflict(
            dayOfWeek: $data['day_of_week'],
            periodStart: $periodStart,
            periodEnd: $periodEnd,
            classroomId: $data['classroom_id'],
            startDate: $startDate,
            endDate: $endDate,
            excludeScheduleId: $data['id'] ?? null // nếu là update thì truyền id vào
        );
        if ($isConflict) {
            return true;
        }
        return false;
    }

    public function checkCourseSectionClassroomConflict(array $data)
    {
        $periodStart = $data['period_start'];
        $periodEnd = $data['period_end'];
        $isConflict = $this->scheduleRepository->hasCourseSectionConflict(
            courseSectionId: $data['course_section_id'],
            dayOfWeek: $data['day_of_week'],
            periodStart: $periodStart,
            periodEnd: $periodEnd,
            excludeScheduleId: $data['id'] ?? null // nếu là update thì truyền id vào
        );
        if ($isConflict) {
            return true;
        }
        return false;
    }

    public function getSchedules(Request $request)
    {
        $data = $request->validated();
        $key = $data['key'] ?? null;
        $dayOfWeek = $data['day_of_week'] ?? null;
        $session = $data['session'] ?? null;
        $page = $data['page'] ?? 1;
        $limit = $data['limit'] ?? 10;
        $semester = $data['semester'] ?? null;
        $classroomId = $data['classroom_id'] ?? null;

        return $this->scheduleRepository->getSchedules($key, $session, $dayOfWeek, $page, $limit, $semester, $classroomId);
    }

    public function delete($id): bool
    {
        $schedule = $this->scheduleRepository->findOrFailById($id);
        if ($schedule->course_section->status !== CourseSectionStatus::InRegister) {
            $courseSectionName = $schedule->course_section->name;
            $status = CourseSectionStatus::getDescription($schedule->course_section->status);
            throw ValidationException::withMessages(["Lớp học phần $courseSectionName $status, không thể xóa lịch"]);
        }
        DB::transaction(function () use ($schedule) {
            $schedule->sessions()->delete();
            $schedule->delete();
        });

        return true;
    }


    public function getSchedulesByTeacher(Request $request)
    {
        $currentTeacherId = $this->getCurrentTeacherId();
        $data = $request->validated();
        $filterDate = $data['filter_date'] ?? now();

        $targetDate = Carbon::parse($filterDate);


        $startOfWeek = $targetDate->copy()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = $targetDate->copy()->endOfWeek(Carbon::SUNDAY);
        $sessions = $this->sessionRepository->getSchedulesByTeacher($currentTeacherId, $startOfWeek, $endOfWeek);

        return [
            'start_of_week' => $startOfWeek,
            'end_of_week' => $endOfWeek,
            'sessions' => $sessions
        ];
    }

     public function getSchedulesByStudent(Request $request)
    {
        $currentStudentId = $this->getCurrentStudentId();
        $data = $request->validated();
        $filterDate = $data['filter_date'] ?? now();

        $targetDate = Carbon::parse($filterDate);

        $startOfWeek = $targetDate->copy()->startOfWeek(Carbon::MONDAY);
        $endOfWeek = $targetDate->copy()->endOfWeek(Carbon::SUNDAY);
        $sessions = $this->sessionRepository->getSchedulesByStudent($currentStudentId, $startOfWeek, $endOfWeek);

        return [
            'start_of_week' => $startOfWeek,
            'end_of_week' => $endOfWeek,
            'sessions' => $sessions
        ];
    }
}
