<?php

namespace App\Services\Schedule;

use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\Schedule\ScheduleRepositoryInterface;
use App\Repositories\Session\SessionRepositoryInterface;
use App\Supports\Log;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Throwable;

class ScheduleService implements ScheduleServiceInterface
{
    use Log;
    protected $scheduleRepository;
    protected $sessionRepository;
    protected $courseSectionRepository;
    public function __construct(
        ScheduleRepositoryInterface $scheduleRepository,
        SessionRepositoryInterface $sessionRepository,
        CourseSectionRepositoryInterface $courseSectionRepository,
    ) {
        $this->scheduleRepository = $scheduleRepository;
        $this->sessionRepository = $sessionRepository;
        $this->courseSectionRepository = $courseSectionRepository;
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
            throw ValidationException::withMessages(['period_start' => 'Phòng học đã bị trùng lịch với lớp khác trong khung giờ này']);
        }

        if ($this->checkCourseSectionClassroomConflict([...$data, 'period_end' => $periodEnd])) {
            throw ValidationException::withMessages(['period_start' => 'Lớp học phần đã có lịch học vào thời gian này (có thể ở phòng khác)']);
        }

        $schedule = $this->scheduleRepository->create([...$data, 'period_end' => $periodEnd]);

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

            $originalDayOfWeek = $schedule->day_of_week;
            $originalPeriodStart = $schedule->period_start;
            $originalPeriodEnd = $schedule->period_end;
            $originalCourseSectionId = $schedule->course_section_id;

            $schedule->day_of_week = $data['day_of_week'] ?? $schedule->day_of_week;
            $schedule->period_start = $data['period_start'] ?? $schedule->period_start;
            $schedule->period_number = $data['period_number'] ?? $schedule->period_number;
            $schedule->period_end =  $schedule->period_start + $schedule->period_number - 1;
            $schedule->course_section_id = $data['course_section_id'] ?? $schedule->course_section_id;
            $schedule->classroom_id = $data['classroom_id'] ?? $schedule->classroom_id;
            $schedule->session = $data['session'] ?? $schedule->session;
            $schedule->save();

            $isSessionRelatedChanged =
                $originalDayOfWeek !== $schedule->day_of_week ||
                $originalPeriodStart !== $schedule->period_start ||
                $originalPeriodEnd !== $schedule->period_end ||
                $originalCourseSectionId !== $schedule->course_section_id;

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
                    DB::rollBack();
                    throw ValidationException::withMessages(['period_start' => 'Phòng học đã bị trùng lịch với lớp khác trong khung giờ này']);
                }

                if ($this->checkCourseSectionClassroomConflict([
                    'period_start' => $schedule->period_start,
                    'period_end' => $schedule->period_end,
                    'course_section_id' => $schedule->course_section_id,
                    'day_of_week' => $schedule->day_of_week->value,
                    'id' => $schedule->id,
                ])) {
                    DB::rollBack();
                    throw ValidationException::withMessages(['period_start' => 'Lớp học phần đã có lịch học vào thời gian này (có thể ở phòng khác)']);
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

        return $this->scheduleRepository->getSchedules($key, $session, $dayOfWeek, $page, $limit, $semester);
    }
}
