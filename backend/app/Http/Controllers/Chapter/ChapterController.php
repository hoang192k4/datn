<?php

namespace App\Http\Controllers\Chapter;

use App\Http\Controllers\BaseController;
use App\Http\Requests\DocumentSubject\ChapterRequest;
use App\Models\Chapter;
use App\Repositories\Chapter\ChapterRepositoryInterface;
use App\Traits\AuthTeacherApi;
use Exception;

class ChapterController extends BaseController
{
    use AuthTeacherApi;
    public function __construct(ChapterRepositoryInterface $repository)
    {
        $this->middleware('auth:teacher');
        $this->repository = $repository;
    }

    public function create(ChapterRequest $request)
    {
        try {
            $data = $request->validated();
            $data['teacher_id'] = $this->getCurrentTeacherId();
            $result = $this->repository->create($data);
            if (!$result) {
                return $this->jsonResponseError();
            }
            return $this->jsonResponseSuccess($result);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống Vui lòng thử lại sau!', 500);
        }
    }


    public function destroy(Chapter $chapter)
    {
        try {
            $chapter->lectures()->delete();
            $result = $chapter->delete();
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Đã xóa chương thành công!');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống Vui lòng thử lại sau!', 500);
        }
    }

    public function update(ChapterRequest $request, Chapter $chapter)
    {
        try{
            $data = $request->validated();
            $data['teacher_id'] = $this->getCurrentTeacherId();
            $result = $chapter->update($data);
            if(!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Đã cập nhật chương thành công!');
        }catch(Exception $e)
        {
            $this->logError($e->getMessage(),$e);
            return $this->jsonResponseError('Lỗi hệ thống Vui lòng thử lại sau!', 500);
        }
    }
}
