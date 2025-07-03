<?php

namespace App\Http\Controllers\Post;

use App\Enums\PublicStatus;
use App\Exceptions\ModelNotFoundByIdException;
use App\Http\Controllers\BaseController;
use App\Http\Requests\Post\PostRequest;
use App\Http\Resources\Post\PostResourceCollection;
use App\Repositories\Post\PostRepositoryInterface;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use App\Services\Post\PostServiceInterface;
use App\Traits\AuthTeacherApi;
use Exception;

class PostController extends BaseController
{
    use AuthTeacherApi;
    protected $teacherRepository;
    protected $postService;
    protected $postRepository;

    public function __construct(
        TeacherRepositoryInterface $teacherRepository,
        PostServiceInterface $postService,
        PostRepositoryInterface $postRepository
    ) {
        $this->teacherRepository = $teacherRepository;
        $this->postService = $postService;
        $this->postRepository = $postRepository;
    }

    public function getPostByTeacherSlug(PostRequest $request)
    {
        try {
            $slug = $request->validated()['slug'] ?? '';
            $limit = $request->validated()['limit'] ?? 3;
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

    public function destroy($id)
    {
        try {
            $this->postRepository->findOrFailById($id);
            $isDeleted = $this->postService->destroyPost($id);
            if (!$isDeleted) {
                return $this->jsonResponseError();
            }
            return $this->jsonResponseSuccess();
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không có resource thuộc id này', 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }

    public function update(PostRequest $request, $id)
    {
        try {
            $this->postRepository->findOrFailById($id);
            $isUpdate = $this->postService->update($request, $id);
            if (!$isUpdate) {
                return $this->jsonResponseError();
            }
            return $this->jsonResponseSuccess();
        } catch (ModelNotFoundByIdException $e) {
            return $this->jsonResponseError('Không có resource thuộc id này', 404);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống', 500);
        }
    }
}
