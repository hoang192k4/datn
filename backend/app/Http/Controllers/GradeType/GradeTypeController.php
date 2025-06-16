<?php

namespace App\Http\Controllers\GradeType;

use App\Http\Controllers\BaseController;
use App\Models\GradeType;

class GradeTypeController extends BaseController
{
    public function index()
    {
        $gradeTypes = GradeType::all();
        return $this->jsonResponseSuccess($gradeTypes);
    }
}
