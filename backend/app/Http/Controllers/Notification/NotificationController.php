<?php

namespace App\Http\Controllers\Notification;

use App\Enums\Notification\NotificationStatus;
use App\Exceptions\ModelNotFoundByIdException;
use Exception;
use App\Models\Notification;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationCourseSectionRequest;
use App\Services\Firebase\FirebaseService;
use App\Services\Firebase\FirebaseServiceInterface;
use App\Http\Requests\Notification\NotificationRequest;
use App\Http\Requests\Notification\NotificationTestRequest;
use App\Services\Notification\NotificationServiceInterface;
use App\Http\Requests\Notification\NotificationStudentsRequest;
use App\Http\Resources\Notification\NotificationResource;
use App\Http\Resources\Notification\NotificationResourceCollection;
use App\Repositories\Notification\NotificationRepositoryInterface;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Validation\ValidationException;

class NotificationController extends BaseController
{

    protected $notificationService;
    protected $notificationRepository;
    public function __construct(
        FirebaseServiceInterface $service,
        NotificationServiceInterface $notificationService,
        NotificationRepositoryInterface $notificationRepository

    ) {
        $this->service = $service;
        $this->notificationService = $notificationService;
        $this->notificationRepository = $notificationRepository;
        $this->middleware('auth:teacher,student');
    }

    public function sendNotification(NotificationTestRequest $request)
    {

        $data = $request->validated();
        $result =  $this->service->sendNotification($data['device_tokens'], $data['title'], $data['body'], $data['data'] ?? []);
        if ($result)
            return $this->jsonResponseSuccessNoData('Gửi thông báo thành công', 200);
        return $this->jsonResponseError('Thêm thất bại', 500);
    }

    public function sendNotifications(NotificationRequest $request)
    {
        try {
            $response = $this->notificationService->sendNotifications($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (ValidationException $e) {
            return $this->jsonResponseErrorValidate('Thực hiện không thành công', 422, $e->errors());
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function sendNotificationToCourseSection(NotificationCourseSectionRequest $request)
    {
        try {
            $response = $this->notificationService->sendNotificationToCourseSection($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getMyNotifications(NotificationRequest $request)
    {
        try {
            $notifications = $this->notificationService->getMyNotifications($request);
            if (!$notifications)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new NotificationResourceCollection($notifications));
        } catch (AuthenticationException $e) {
            return $this->jsonResponseError($e->getMessage(), 401);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function destroy($id)
    {
        try {
            $instance = $this->notificationRepository->findOrFailById($id);
            $instance->delete();
            return $this->jsonResponseSuccess();
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không có instance theo id ' . $id, 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }


    public function update(NotificationRequest $request, $id)
    {
        try {
            $this->notificationRepository->findOrFailById($id);
            $isUpdated = $this->notificationService->update($request, $id);
            if (!$isUpdated) {
                return $this->jsonResponseError();
            }
            return $this->jsonResponseSuccess(new NotificationResource($isUpdated));
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không có instance theo id ' . $id, 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function updateStatus($id)
    {
        try {
            $notification = $this->notificationRepository->findOrFailById($id);
            $notification->status = NotificationStatus::Read;
            $notification->save();

            return $this->jsonResponseSuccess(new NotificationResource($notification));
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không có instance theo id ' . $id, 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
