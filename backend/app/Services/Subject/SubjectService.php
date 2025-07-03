<?php

namespace App\Services\Subject;

use App\Enums\Subject\SubjectStatus;
use App\Models\Subject;
use App\Repositories\Subject\SubjectRepository;
use App\Repositories\Subject\SubjectRepositoryInterface;
use Illuminate\Http\Request;

class SubjectService implements SubjectServiceInterface
{
    protected $subjectRepository;

    public function __construct(
        SubjectRepositoryInterface $subjectRepository
    ) {
        $this->subjectRepository = $subjectRepository;
    }


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

    public function getSubjectsByTeacherSlug(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['key'] ?? null;
        $slug = $data['slug'] ?? '';

        return $this->subjectRepository->getSubjectsByTeacherSlug($slug, $limit, $page, $key);
    }
}
