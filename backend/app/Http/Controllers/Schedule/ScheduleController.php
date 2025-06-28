<?php

namespace App\Http\Controllers\Schedule;

use App\Exceptions\ModelNotFoundByIdException;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Schedule\ScheduleRequest;
use App\Services\Schedule\ScheduleServiceInterface;
use Exception;
use Illuminate\Validation\ValidationException;
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
}
