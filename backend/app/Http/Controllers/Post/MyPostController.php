<?php

namespace App\Http\Controllers\Post;

use App\Enums\PublicStatus;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Post\PostRequest;
use App\Http\Requests\Search\SearchRequest;
use App\Http\Resources\Post\PostResourceCollection;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Traits\AuthTeacherApi;
use Exception;

class MyPostController extends BaseController
{
    use AuthTeacherApi;
    protected $teacherRepository;

    public function __construct(
        TeacherRepositoryInterface $teacherRepository
    ) {
        $this->teacherRepository = $teacherRepository;
        $this->middleware('auth:teacher', ['except' => ['getPostByTeacherSlug']]);
    }
    public function getPostByTeacherId(SearchRequest $request)
    {
        try {
            $teacherId = $this->getCurrentTeacherId();
            $data = $request->validated();
            $limit = $data['limit'] ?? 10;
            $page = $data['page'] ?? 1;
            $key = $data['key'] ?? null;
            $teacher = $this->teacherRepository->findOrFailById($teacherId);

            $posts = $teacher->posts()->where('title', 'like', '%' . $key . '%')->orWhere('content', 'like', '%' . $key . '%')->orderBy('created_at', 'desc')->paginate($limit, ['*'], 'page', $page)->appends(['limit' => $limit]);

            if (!$posts)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess(new PostResourceCollection($posts));
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
