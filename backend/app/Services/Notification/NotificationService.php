<?php

namespace App\Services\Notification;

use App\Enums\Notification\NotificationType;
use App\Exceptions\ModelNotFoundByIdException;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
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
    protected $courseSectionRepository;
    public function __construct(
        NotificationRepositoryInterface $repository,
        FirebaseServiceInterface $firebaseService,
        StudentRepositoryInterface $studentRepository,
        CourseSectionRepositoryInterface $courseSectionRepository
    ) {
        $this->repository = $repository;
        $this->firebaseService = $firebaseService;
        $this->studentRepository = $studentRepository;
        $this->courseSectionRepository = $courseSectionRepository;
    }


    public function sendNotifications(Request $request)
    {
        try {

            $data = $request->validated();
            $type = $data['type'];
            $title = $data['title'];
            $body = $data['body'];
            $receiver_ids = $data['receiver_ids'];

            switch ($type) {
                case NotificationType::TeacherSend->value:
                    return $this->sendNotificationToStudents($title, $body, $receiver_ids, $type);
                    break;
                case NotificationType::AdminSend->value:

                    break;
            }

            return false;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
    public function sendNotificationToStudents(string $title, string $body, array $student_ids, string $type)
    {
        $teacherId = $this->getCurrentTeacherId();
        $students = $this->studentRepository->findMany($student_ids);

        if (count($students) == 0)
            return false;
        $notifications = $students->map(function ($student) use ($title, $body, $teacherId, $type) {
            return [
                'teacher_id' => $teacherId,
                'student_id' => $student->id,
                'title' => $title,
                'content' => $body,
                'type' => $type,
            ];
        })->toArray();
        $this->repository->inserts($notifications);
        $deviceTokens = $students->pluck('device_token')->filter()->values();

        $this->firebaseService->sendNotification($deviceTokens, $title, $body, null);
        return true;
    }


    public function sendNotificationToCourseSection(Request $request)
    {
        try {
            $data = $request->validated();
            $title = $data['title'];
            $body = $data['body'];
            $courseSection = $this->courseSectionRepository->findOrFailById($data['course_section_id']);
            $studentIds = $courseSection->students->pluck('id')->values()->toArray();
            $this->sendNotificationToStudents($title, $body, $studentIds, NotificationType::TeacherSend->value);
            return true;
        } catch (ModelNotFoundByIdException) {
            return false;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
