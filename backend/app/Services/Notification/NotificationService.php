<?php

namespace App\Services\Notification;

use App\Enums\Notification\NotificationType;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Services\Firebase\FirebaseServiceInterface;
use App\Supports\Log;
use App\Traits\AuthStudentApi;
use App\Traits\AuthTeacherApi;
use DeepCopy\Filter\Filter;
use Exception;
use Illuminate\Http\Request;


class NotificationService implements NotificationServiceInterface
{
    use AuthTeacherApi, AuthStudentApi, Log;

    protected $repository;
    protected $service;
    protected $firebaseService;
    protected $studentRepository;
    public function __construct(
        NotificationRepositoryInterface $repository,
        FirebaseServiceInterface $firebaseService,
        StudentRepositoryInterface $studentRepository
    ) {
        $this->repository = $repository;
        $this->firebaseService = $firebaseService;
        $this->studentRepository = $studentRepository;
    }


    public function sendNotifications(Request $request): bool
    {
        try {
            $data = $request->validated();
            $type = $data['type'];

            switch ($type) {
                case NotificationType::TeacherSend:

                    break;
                case NotificationType::AdminSend:
                    break;
            }

            return $data;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
    public function sendNotificationToStudents(Request $request)
    {
        $data = $request->validated();

        $students = $this->studentRepository->findMany($data['student_ids']);
        $deviceTokens = $students->pluck('device_token')->filter()->values();
        dd($students);
    }
}
