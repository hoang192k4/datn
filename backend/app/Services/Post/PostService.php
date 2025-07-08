<?php

namespace App\Services\Post;

use App\Enums\Notification\NotificationType;
use App\Enums\Student\StudentStatus;
use App\Models\Post;
use Exception;
use App\Supports\Log;
use Illuminate\Support\Facades\DB;
use App\Repositories\Post\PostRepositoryInterface;
use App\Repositories\Notification\NotificationRepositoryInterface;
use App\Services\Notification\NotificationServiceInterface;
use Illuminate\Http\Request;

class PostService implements PostServiceInterface
{
    use Log;
    protected $postRepository;
    protected $notificationRepository;
    protected $notificationService;
    public function __construct(
        PostRepositoryInterface $postRepository,
        NotificationRepositoryInterface $notificationRepository,
        NotificationServiceInterface $notificationService,

    ) {
        $this->notificationRepository = $notificationRepository;
        $this->postRepository = $postRepository;
        $this->notificationService = $notificationService;
    }

    public function destroyPost($postId): bool
    {
        DB::beginTransaction();
        try {
            $post = $this->postRepository->findOrFailById($postId);
            $this->notificationRepository->deleteByConditions(['post_id' => $postId]);
            $post->delete();
            DB::commit();
            return true;
        } catch (Exception $e) {
            DB::rollBack();
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function update(Request $request, $id): bool|object
    {
        try {
            $data = $request->validated();
            $isPushNotification = $data['push_notification'] ?? null;

            $isUpdate = $this->postRepository->update($id, $data);
            if (!$isUpdate) {
                return false;
            }

            $post = $this->postRepository->find($id);
            if ($isPushNotification) {
                $this->sendNotification($post->course_section, $post);
            }

            return $post;
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }


    protected function getStudentIds($courseSection)
    {
        return $courseSection->students->where('status', StudentStatus::Active)->pluck('id')->toArray();
    }

    protected function sendNotification($courseSection, $post)
    {
        $studentIds = $this->getStudentIds($courseSection);
        $this->notificationService->sendNotificationToStudents($post->title, $post->content, $studentIds, NotificationType::TeacherSend->value, $post->id);
        return true;
    }
}
