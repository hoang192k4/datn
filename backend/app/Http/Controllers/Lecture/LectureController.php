<?php

namespace App\Http\Controllers\Lecture;

use App\Http\Controllers\BaseController;
use App\Http\Requests\DocumentSubject\LectureRequest;
use App\Models\Lecture;
use App\Repositories\Lecture\LectureRepositoryInterface;
use Exception;
use Illuminate\Http\Request;

class LectureController extends BaseController
{
    public function __construct(LectureRepositoryInterface $repository)
    {
        $this->middleware('auth:teacher');
        $this->repository = $repository;
    }

    public function create(LectureRequest $request)
    {
        try {
            $data = $request->validated();
            $result = $this->repository->create($data);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccess($result);
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống Vui lòng thử lại sau.', 500);
        }
    }

    public function destroy(Lecture $lecture)
    {
        try {
            $result = $lecture->delete();
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Đã xóa bài giảng thành công!');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError();
        }
    }

    public function update(LectureRequest $request, Lecture $lecture)
    {
        try {
            $data = $request->validated();
            $result = $lecture->update($data);
            if (!$result)
                return $this->jsonResponseError();
            return $this->jsonResponseSuccessNoData('Đã cập nhật bài giảng thành công!');
        } catch (Exception $e) {
            $this->logError($e->getMessage(), $e);
            return $this->jsonResponseError('Lỗi hệ thống Vui lòng thử lại sau.', 500);
        }
    }
}
