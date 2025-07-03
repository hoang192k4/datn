<?php

namespace App\Repositories\Subject;

use App\Repositories\EloquentRepositoryInterface;

interface SubjectRepositoryInterface extends EloquentRepositoryInterface
{
    public function getSubjectsByTeacherSlug($slug, $limit, $page, $key);
}
