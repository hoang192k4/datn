<?php

namespace App\Services\Subject;

use App\Enums\Subject\SubjectStatus;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectService implements SubjectServiceInterface
{
    public function getListSubjects(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['key'] ?? null;

        $query = Subject::query();
        if ($key)
            $query->where('name', 'like', '%' . $key . '%');
        $subjects = $query->where('status', SubjectStatus::Active)->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)->appends(['limit' => $limit]);
        return $subjects;
    }
}
