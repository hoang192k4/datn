<?php

namespace App\Http\Requests\DocumentSubject;

use App\Http\Requests\BaseRequest;
use App\Models\Chapter;
use App\Traits\AuthTeacherApi;
use Illuminate\Validation\Validator;

class ChapterRequest extends BaseRequest
{
    use AuthTeacherApi;
    public function methodPost()
    {
        return [
            'subject_id' => 'required|integer|exists:subjects,id',
            'title' => 'required|max:255|string',
            'position' => 'required|integer|max:99999',
        ];
    }

    public function methodPut()
    {
        return [
            'subject_id' => 'integer|exists:subjects,id',
            'title' => 'max:255|string',
            'position' => 'integer|max:99999',
        ];
    }

    public function messages()
    {
        return [
            'position.max' => 'Thứ tự chương không được vượt quá 5 chữ số',
            'title.max' => 'Tên chương không được vượt quá 255 kí tự'
        ];
    }

    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $teacherId = $this->getCurrentTeacherId();
            $subjectId = $this['subject_id'];
            $title = $this['title'];
            $position = $this['position'];
            $checkTitle = Chapter::where('subject_id', $subjectId)
                ->where('teacher_id', $teacherId)->where('title', $title)->exists();
            $checkPosition = Chapter::where('subject_id', $subjectId)
                ->where('teacher_id', $teacherId)->where('position', $position)->exists();
            if ($checkTitle)
                $validator->errors()->add('title', 'Tên chương đã tồn tại!');

            if ($checkPosition)
                $validator->errors()->add('position', 'Thứ tự chương đã tồn tại!');
        });
    }
}
