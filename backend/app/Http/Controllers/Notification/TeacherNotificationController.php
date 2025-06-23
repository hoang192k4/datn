<?php

namespace App\Http\Controllers\Notification;

use Exception;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationSearchRequest;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Notification\StudentNotificationResourceCollection;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Traits\AuthTeacherApi;

class TeacherNotificationController extends BaseController
{
    use AuthTeacherApi;
    protected $notificationRepository;
    public function __construct(
        NotificationRepositoryInterface $notificationRepository
    ) {
        $this->notificationRepository = $notificationRepository;
        $this->middleware('auth:teacher');
    }

    public function getNotificationSendStudentByTeacher(NotificationSearchRequest $request)
    {
        try {
            $teacherId = $this->getCurrentTeacherId();
            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;
            $key = $data['key'] ?? null;
            $status = $data['status'] ?? null;

            $notifications = $this->notificationRepository->getMyTeacherNotificationSendStudent($teacherId, $page, $limit, $key, $status);

            return $this->jsonResponseSuccess(new StudentNotificationResourceCollection($notifications));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
