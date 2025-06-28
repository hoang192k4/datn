<?php

namespace App\Repositories\Schedule;

use App\Models\Schedule;
use App\Repositories\EloquentRepository;

class ScheduleRepository extends EloquentRepository implements ScheduleRepositoryInterface
{
    public function getModel()
    {
        return Schedule::class;
    }

    public function hasConflict(int $dayOfWeek, int $periodStart, int $periodEnd, int $classroomId, $startDate, $endDate, ?int $excludeScheduleId): bool
    {
        return $this->model->where('day_of_week', $dayOfWeek)
            ->where('classroom_id', $classroomId)
            ->when($excludeScheduleId, fn($q) => $q->where('id', '!=', $excludeScheduleId))
            ->where(function ($query) use ($periodStart, $periodEnd) {
                $query->whereBetween('period_start', [$periodStart, $periodEnd])
                    ->orWhereBetween('period_end', [$periodStart, $periodEnd])
                    ->orWhere(function ($query) use ($periodStart, $periodEnd) {
                        $query->where('period_start', '<=', $periodStart)
                            ->where('period_end', '>=', $periodEnd);
                    });
            })
            ->whereHas('course_section', function ($query) use ($startDate, $endDate) {
                $query->where('start_date', '<=', $endDate)
                    ->where('end_date', '>=', $startDate);
            })->exists();
    }

    public function hasCourseSectionConflict(
        int $courseSectionId,
        string $dayOfWeek,
        int $periodStart,
        int $periodEnd,
        ?int $excludeScheduleId = null
    ): bool {
        return $this->model->where('course_section_id', $courseSectionId)
            ->where('day_of_week', $dayOfWeek)
            ->when($excludeScheduleId, fn($q) => $q->where('id', '!=', $excludeScheduleId))
            ->where(function ($query) use ($periodStart, $periodEnd) {
                $query->whereBetween('period_start', [$periodStart, $periodEnd])
                    ->orWhereBetween('period_end', [$periodStart, $periodEnd])
                    ->orWhere(function ($q) use ($periodStart, $periodEnd) {
                        $q->where('period_start', '<=', $periodStart)
                            ->where('period_end', '>=', $periodEnd);
                    });
            })
            ->exists();
    }
}
