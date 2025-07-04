<?php

namespace App\Repositories\Subject;

use App\Enums\Subject\SubjectStatus;
use App\Models\Subject;
use App\Repositories\EloquentRepository;

class SubjectRepository extends EloquentRepository implements SubjectRepositoryInterface
{
    public function getModel()
    {
        return Subject::class;
    }

    public function getSubjectsByTeacherSlug($slug, $limit, $page, $key)
    {
        $query = $this->model->query();

        $query->whereHas('teachers', function ($q) use ($slug) {
            $q->where('slug', $slug);
        });

        if ($key)
            $query->where('name', 'like', '%' . $key . '%');

        return $query->where('status', SubjectStatus::Active)->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page);
    }
}
