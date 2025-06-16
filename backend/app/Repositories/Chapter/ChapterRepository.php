<?php

namespace App\Repositories\Chapter;

use App\Models\Chapter;
use App\Repositories\EloquentRepository;

class ChapterRepository extends EloquentRepository implements ChapterRepositoryInterface
{
    public function getModel()
    {
        return Chapter::class;
    }
}