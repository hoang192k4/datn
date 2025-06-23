<?php

namespace App\Services\Student;

use Illuminate\Http\Request;

interface StudentServiceInterface
{
    public function create(Request $request);
    public function getAllStudents(Request $request);
}
