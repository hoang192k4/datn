<?php

namespace App\Services\Subject;

use Illuminate\Http\Request;

interface SubjectServiceInterface
{
    public function getListSubjects(Request $request);
    
}
