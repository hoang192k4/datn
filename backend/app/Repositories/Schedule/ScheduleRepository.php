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


    public function getSchedules(?string $key = null, $session = null, ?int $dayOfWeek = null, $page, $limit, ?int $semester = null, ?int $classroomId = null)
    {
        return  $this->model->with(['course_section.subject', 'course_section.teacher', 'classroom'])
            ->when($key, function ($query, $key) {
                $query->where(function ($q) use ($key) {
                    $q->whereHas('course_section', function ($q) use ($key) {
                        $q->where('name', 'like', "%$key%")
                            ->orWhereHas('subject', fn($q) => $q->where('name', 'like', "%$key%"))
                            ->orWhereHas('teacher', fn($q) => $q->where('name', 'like', "%$key%"));
                    })->orWhereHas('classroom', fn($q) => $q->where('name', 'like', "%$key%"));
                });
            })
            ->when($session, function ($query, $session) {
                $query->where('session', $session);
            })
            ->when($dayOfWeek, function ($query, $dayOfWeek) {
                $query->where('day_of_week', $dayOfWeek);
            })
            ->when($semester, function ($query, $semester) {
                $query->whereHas('course_section', function ($subQuery) use ($semester) {
                    $subQuery->where('semester_id', $semester);
                });
            })
            ->when($classroomId, function ($query, $classroomId) {
                $query->where('classroom_id', $classroomId);
            })
            ->orderBy('day_of_week')
            ->orderBy('period_start')
            ->paginate($limit, ['*'], 'page', $page);
    }
}
