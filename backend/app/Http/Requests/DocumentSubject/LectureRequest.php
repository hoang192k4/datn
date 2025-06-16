<?php

namespace App\Http\Requests\DocumentSubject;

use App\Enums\PublicStatus;
use App\Http\Requests\BaseRequest;
use App\Models\Lecture;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\Validator;

class LectureRequest extends BaseRequest
{
    public function methodPost()
    {
        return [
            'chapter_id' => 'required|integer|exists:chapters,id',
            'title' => 'required|string|max:255',
            'file_path' => 'required|max:255',
            'position' => 'required|max:99999',
            'status' => [new Enum(PublicStatus::class)]
        ];
    }

    public function methodPut()
    {
        return [
            'chapter_id' => 'integer|exists:chapters,id',
            'title' => 'string|max:255',
            'file_path' => 'max:255',
            'position' => 'max:99999',
            'status' => [new Enum(PublicStatus::class)]
        ];
    }

    public function messages()
    {
        return [
            'title.max' => 'Vui lòng không nhập tên bài giảng quá 255 kí tự!',
            'file_path' => 'Vui lòng không nhập đường dẫn quá 255 kí tự!',
            'position.max' => 'Vui lòng không nhập thứ tự bài giảng quá 5 chữ số!'
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $title = $this['title'];
            $position = $this['position'];
            $chapterId = $this['chapter_id'];
            $checkTitle = Lecture::where('chapter_id', $chapterId)->where('title', $title)->exists();
            $checkPosition = Lecture::where('chapter_id', $chapterId)->where('position', $position)->exists();
            if ($checkTitle)
                $validator->errors()->add('title', 'Tên bài giảng đã trùng lặp');
            if ($checkPosition)
                $validator->errors()->add('position', 'Thứ tự bài giảng đã bị trùng lặp');
        });
    }
}
