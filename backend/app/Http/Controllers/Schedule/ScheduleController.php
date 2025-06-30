<?php

namespace App\Http\Controllers\Schedule;

use App\Exceptions\ModelNotFoundByIdException;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Schedule\ScheduleRequest;
use App\Http\Resources\Schedule\ScheduleResource;
use App\Http\Resources\Schedule\ScheduleResourceCollection;
use App\Repositories\Schedule\ScheduleRepositoryInterface;
use App\Services\Schedule\ScheduleServiceInterface;
use Exception;
use Illuminate\Validation\ValidationException;
use Throwable;

class ScheduleController extends BaseController
{
    protected $scheduleService;
    protected $scheduleRepository;
    public function __construct(
        ScheduleServiceInterface $scheduleService,
        ScheduleRepositoryInterface $scheduleRepository,
    ) {
        $this->scheduleService = $scheduleService;
        $this->scheduleRepository = $scheduleRepository;
        $this->middleware('auth:teacher');
        $this->middleware('role:faculty_admin,department_admin')->except(['index']);
    }
    public function create(ScheduleRequest $request)
    {
        try {
            $isCreated = $this->scheduleService->create($request);
            if (!$isCreated)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Thực hiện không thành công', 422, $e->errors());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }


    public function update(ScheduleRequest $request, $id)
    {
        try {
            $isUpdated = $this->scheduleService->update($request, $id);
            if (!$isUpdated)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không có resource theo id' . $id, 404);
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Thực hiện không thành công', 422, $e->errors());
        } catch (Exception $e) {

            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function index(ScheduleRequest $request)
    {
        try {
            $schedules = $this->scheduleService->getSchedules($request);
            return $this->jsonResponseSuccess(new ScheduleResourceCollection($schedules));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }


    public function delete($id)
    {
        try {
            $isDeleted = $this->scheduleService->delete($id);

            if (!$isDeleted)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Thực hiện không thành công', 400, $e->errors());
        } catch (ModelNotFoundByIdException) {
            return $this->jsonResponseError("Không tìm thấy instance theo id $id", 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
