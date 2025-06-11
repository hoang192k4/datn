<?php

namespace App\Services\Notification;

use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Services\Firebase\FirebaseServiceInterface;
use App\Traits\AuthStudentApi;
use App\Traits\AuthTeacherApi;
use DeepCopy\Filter\Filter;
use Illuminate\Http\Request;


class NotificationService implements NotificationServiceInterface
{
    use AuthTeacherApi, AuthStudentApi;

    protected $repository;
    protected $service;
    protected $firebaseService;
    protected $studentRepository;
    public function __construct(
        NotificationServiceInterface $service,
        NotificationRepositoryInterface $repository,
        FirebaseServiceInterface $firebaseService,
        StudentRepositoryInterface $studentRepository
    ) {
        $this->repository = $repository;
        $this->service = $service;
        $this->firebaseService = $firebaseService;
        $this->studentRepository = $studentRepository;
    }

    public function sendNotificationToStudents(Request $request)
    {
        $data = $request->validated();
        dd($data);
        $student = $this->studentRepository->findMany($data['student_ids']);
        $deviceTokens = $students->pluck('device_token')->filter()->values();
        dd($deviceTokens);
    }
}
