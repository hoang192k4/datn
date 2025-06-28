<?php

namespace App\Services\Schedule;

use App\Repositories\Schedule\ScheduleRepositoryInterface;
use App\Repositories\Session\SessionRepositoryInterface;
use App\Supports\Log;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Throwable;

class ScheduleService implements ScheduleServiceInterface
{
    use Log;
    protected $scheduleRepository;
    protected $sessionRepository;
    public function __construct(
        ScheduleRepositoryInterface $scheduleRepository,
        SessionRepositoryInterface $sessionRepository
    ) {
        $this->scheduleRepository = $scheduleRepository;
        $this->sessionRepository = $sessionRepository;
    }

    public function create(Request $request)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $periodNumber = $data['period_number'];
            $periodStart = $data['period_start'];
            $periodEnd = $periodStart + $periodNumber - 1;

            $schedule = $this->scheduleRepository->create([...$data, 'period_end' => $periodEnd]);

            $sessions = $this->generateSessionsFromSchedule($schedule);
            $isSessionsCreated = $this->sessionRepository->inserts($sessions);

            if (!$isSessionsCreated) {
                DB::rollBack();
                return false;
            }
            DB::commit();
            return true;
        } catch (Throwable $e) {
            $this->logError($e->getMessage(), $e);
            DB::rollBack();
            throw new Exception($e);
        }
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
}
