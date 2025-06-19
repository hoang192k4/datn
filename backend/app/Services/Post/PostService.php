<?php

namespace App\Services\Post;

use Exception;
use App\Supports\Log;
use Illuminate\Support\Facades\DB;
use App\Exceptions\ModelNotFoundByIdException;
use App\Repositories\Post\PostRepositoryInterface;
use App\Repositories\Notification\NotificationRepositoryInterface;

class PostService implements PostServiceInterface
{
    use Log;
    protected $postRepository;
    protected $notificationRepository;

    public function __construct(
        PostRepositoryInterface $postRepository,
        NotificationRepositoryInterface $notificationRepository,
    ) {
        $this->notificationRepository = $notificationRepository;
        $this->postRepository = $postRepository;
    }

    public function destroyPost($postId)
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
}
