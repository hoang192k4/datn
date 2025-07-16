<?php

namespace App\Http\Controllers\Notification;

use App\Enums\Notification\NotificationType;
use Exception;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationRequest;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Notification\FeedbackRourceCollection;
use App\Http\Resources\Notification\NotificationResourceCollection;
use App\Http\Resources\Notification\StudentNotificationResourceCollection;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Services\Notification\NotificationServiceInterface;
use App\Traits\AuthStudentApi;

class StudentNotificationController extends BaseController
{

    use AuthStudentApi;
    public function __construct(
        NotificationServiceInterface $notificationService,
        NotificationRepositoryInterface $notificationRepository
    ) {
        $this->service = $notificationService;
        $this->repository = $notificationRepository;
        $this->middleware('auth:student');
    }

    public function sendFeedbackToTeacher(NotificationRequest $request)
    {
        try {
            $response = $this->service->sendFeedbackToTeacher($request);
            if (!$response)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData();
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function getFeedbackStudentSended(SearchRequest $request)
    {
        try {
            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;
            $key = $data['key'] ?? null;
            $feedbacks = $this->repository->getList(['student_id' => $this->getCurrentStudentId(), 'type' => NotificationType::StudentSend], ['created_at' => 'desc'], [], $limit, $page, ['title' => ['like', $key], 'content' => ['like', $key]]);
            return $this->jsonResponseSuccess(new FeedbackRourceCollection($feedbacks));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
