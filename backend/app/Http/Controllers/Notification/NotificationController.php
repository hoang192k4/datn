<?php
namespace App\Http\Controllers\Notification;

use App\Http\Controllers\BaseController;
use App\Http\Requests\Notification\NotificationRequest;
use App\Models\Notification;
use App\Services\Firebase\FirebaseService;
use App\Services\Firebase\FirebaseServiceInterface;
use Exception;

class NotificationController extends BaseController
{

    public function __construct(
        FirebaseServiceInterface $service
    ) {
        $this->service = $service;
        // $this->middleware('auth:teacher');
    }

    public function sendNotification(NotificationRequest $request)
    {
        $data = $request->validated();
        $result =  $this->service->sendNotification($data['device_tokens'], $data['title'], $data['body'], $data['data']??[]);
        if($result)
            return $this->jsonResponseSuccessNoData('Gửi thông báo thành công', 200);
        return $this->jsonResponseError('Thêm thất bại', 500);
    }
}
