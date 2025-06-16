<?php

namespace App\Http\Requests\DocumentSubject;

use App\Http\Requests\BaseRequest;

class SubjectRequest extends BaseRequest
{
    public function methodGet()
    {
        return [
            'subject_id' => 'required|exists:subjects,id',
        ];
    }
}
