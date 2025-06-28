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
}
