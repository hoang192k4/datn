<?php

namespace App\Http\Controllers\Post;

use App\Enums\PublicStatus;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Post\PostRequest;
use App\Http\Resources\Post\PostResourceCollection;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use Exception;

class PostController extends BaseController
{
    protected $teacherRepository;

    public function __construct(
        TeacherRepositoryInterface $teacherRepository
    ) {
        $this->teacherRepository = $teacherRepository;
    }

    public function getPostByTeacherSlug(PostRequest $request)
    {
        try {
            $slug = $request->validated()['slug'];
            $limit = $request->validated()['limit'] ?? 5;
            $page = $request->validated()['page'] ?? 1;
            $teacher = $this->teacherRepository->findWithConditions(['slug' => $slug]);

            $posts = $teacher->posts()->where('status', PublicStatus::Public)->orderBy('created_at', 'desc')->paginate($limit, ['*'], 'page', $page)->appends(['limit' => $limit]);

            if (!$posts)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new PostResourceCollection($posts));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
