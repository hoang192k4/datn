<?php

namespace App\Http\Controllers\Schedule;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Schedule\ScheduleRequest;
use App\Services\Schedule\ScheduleServiceInterface;
use Exception;
use Throwable;

class ScheduleController extends BaseController
{
    protected $scheduleService;
    public function __construct(
        ScheduleServiceInterface $scheduleService
    ) {
        $this->scheduleService = $scheduleService;
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin');
    }
    public function create(ScheduleRequest $request)
    {
        try {
            $isCreated = $this->scheduleService->create($request);
            if (!$isCreated)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 400);
        }
    }
}
