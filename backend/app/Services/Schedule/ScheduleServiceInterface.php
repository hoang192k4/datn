<?php

namespace App\Services\Schedule;

use Illuminate\Http\Request;

interface ScheduleServiceInterface
{
    public function create(Request $request);
    public function update(Request $request, $id);
    public function checkScheduleConflict(array $data): bool;
    public function checkCourseSectionClassroomConflict(array $data);
    public function getSchedules(Request $request);
}
