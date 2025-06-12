<?php

namespace App\Services\Notification;

use App\Enums\Guard;
use App\Enums\Notification\NotificationType;
use App\Enums\PublicStatus;
use App\Enums\Role;
use App\Enums\SendToUserType;
use App\Exceptions\ModelNotFoundByIdException;
use App\Models\Student;
use App\Models\Teacher;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Repositories\Post\PostRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Services\Firebase\FirebaseServiceInterface;
use App\Supports\Log;
use App\Traits\AuthApi;
use App\Traits\AuthStudentApi;
use App\Traits\AuthTeacherApi;
use DeepCopy\Filter\Filter;
use Exception;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationService implements NotificationServiceInterface
{
    use AuthTeacherApi, AuthStudentApi, Log, AuthApi;

    protected $repository;
    protected $service;
    protected $firebaseService;
    protected $studentRepository;
    protected $courseSectionRepository;
    protected $postRepository;
    public function __construct(
        NotificationRepositoryInterface $repository,
        FirebaseServiceInterface $firebaseService,
        StudentRepositoryInterface $studentRepository,
        CourseSectionRepositoryInterface $courseSectionRepository,
        PostRepositoryInterface $postRepository
    ) {
        $this->repository = $repository;
        $this->firebaseService = $firebaseService;
        $this->studentRepository = $studentRepository;
        $this->courseSectionRepository = $courseSectionRepository;
        $this->postRepository = $postRepository;
    }

    public function sendNotifications(Request $request)
    {
        try {
            $data = $request->validated();
            $title = $data['title'];
            $body = $data['body'];
            $receiver_ids = $data['receiver_ids'];
            $sendTo = $data['send_to'] ?? SendToUserType::All->value;
            $role = $this->getCurrentTeacherRole();
            $currentTeacherId = $this->getCurrentTeacherId();
            if ($role === Role::SUBJECT_TEACHER || $role === Role::HOMEROOM_TEACHER)
                $type = NotificationType::TeacherSend->value;
            else
                $type = NotificationType::AdminSend->value;

            switch ($type) {
                case NotificationType::TeacherSend->value:
                    return $this->sendNotificationToStudents($title, $body, $receiver_ids, $type);
                    break;
                case NotificationType::AdminSend->value: {
                        switch ($sendTo) {
                            case SendToUserType::All->value:
                                return $this->sendNotificationToAll($title, $body, $type);
                                break;
                            case SendToUserType::AllStudent->value: {
                                    return $this->sendNotificationToAllStudent($currentTeacherId, $title, $body, $type);
                                    break;
                                }

                            case SendToUserType::AllTeacher->value: {
                                    return $this->sendNotificationToAllTeacher($currentTeacherId, $title, $body, $type);
                                    break;
                                }
                            default:
                                return false;
                        }
                    }
                    break;

                default:
                    return false;
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
            $teacherSendId = $this->getCurrentTeacherId();
            $data = $request->validated();
            $title = $data['title'];
            $body = $data['body'];
            $publicStatus = $data['public_type'] ?? PublicStatus::Public;
            $courseSection = $this->courseSectionRepository->findOrFailById($data['course_section_id']);
            $studentIds = $courseSection->students->pluck('id')->values()->toArray();
            $this->postRepository->create(['title' => $title, 'content' => $body, 'course_section_id' => $courseSection->id, 'teacher_id' => $teacherSendId, 'status' => $publicStatus]);
            $this->sendNotificationToStudents($title, $body, $studentIds, NotificationType::TeacherSend->value);
            return true;
        } catch (ModelNotFoundByIdException $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function sendNotificationToAll(string $title, string $body, string $type)
    {
        $currentTeacherId = $this->getCurrentTeacherId();

        $statusSendAllTeacher = $this->sendNotificationToAllTeacher($currentTeacherId, $title, $body, $type);
        $statusSendAllStudent = $this->sendNotificationToAllStudent($currentTeacherId, $title, $body, $type);

        if ($statusSendAllTeacher && $statusSendAllStudent)
            return true;
        return false;
    }


    public function sendNotificationToAllTeacher($teacherSendId, string $title, string $body, string $type)
    {
        DB::beginTransaction();
        try {
            Teacher::where('id', '!=', $teacherSendId)
                ->chunk(100, function ($teachers) use ($title, $body, $teacherSendId, $type) {

                    $notifications = $teachers->map(function ($teacher) use ($title, $body, $teacherSendId, $type) {
                        return [
                            'teacher_id' => $teacherSendId,
                            'teacher_receive_id' => $teacher->id,
                            'title' => $title,
                            'content' => $body,
                            'type' => $type,
                        ];
                    })->toArray();
                    $this->repository->inserts($notifications);
                    $deviceTokens = $teachers->pluck('device_token')->filter()->values();
                    $this->firebaseService->sendNotification($deviceTokens, $title, $body, null);
                });
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return false;
        }
    }

    public function sendNotificationToAllStudent($teacherSendId, string $title, string $body, string $type)
    {
        DB::beginTransaction();
        try {
            Student::chunk(100, function ($students) use ($title, $body, $teacherSendId, $type) {

                $notifications = $students->map(function ($student) use ($title, $body, $teacherSendId, $type) {
                    return [
                        'teacher_id' => $teacherSendId,
                        'student_id' => $student->id,
                        'title' => $title,
                        'content' => $body,
                        'type' => $type,
                    ];
                })->toArray();
                $this->repository->inserts($notifications);
                $deviceTokens = $students->pluck('device_token')->filter()->values();
                $this->firebaseService->sendNotification($deviceTokens, $title, $body, null);
            });
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            return false;
        }
    }



    public function getMyNotifications(Request $request)
    {
        try {
            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page =  $data['page'] ?? 1;

            $type =  isset($data['type']) == null ? NotificationType::AdminSend : $data['type'];

            $currentUserId = getCurrentUserId();
            $guard = getCurrentGuard();
            if ($guard == Guard::TEACHER)
                $notifications = $this->repository->getList(['teacher_receive_id' => $currentUserId, 'type' =>  $type], ['created_at' => 'desc'], ['teacher'], $limit, $page);
            if ($guard == Guard::STUDENT) {
                $notifications = $this->repository->getList(['student_id' => $currentUserId], ['created_at' => 'desc'], ['teacher'], $limit, $page);
            }

            return $notifications;
        } catch (AuthenticationException $e) {
            throw new AuthenticationException('Không xác định được người dùng');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }
}
