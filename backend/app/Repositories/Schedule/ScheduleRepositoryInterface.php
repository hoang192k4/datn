<?php

namespace App\Repositories\Schedule;

use App\Repositories\EloquentRepositoryInterface;

interface ScheduleRepositoryInterface extends EloquentRepositoryInterface
{
    public function hasConflict(int $dayOfWeek, int $periodStart, int $periodEnd, int $classroomId, $startDate, $endDate, ?int $excludeScheduleId): bool;
    public function hasCourseSectionConflict(int $courseSectionId, string $dayOfWeek, int $periodStart, int $periodEnd, ?int $excludeScheduleId = null): bool;
}
