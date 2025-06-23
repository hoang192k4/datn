<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\BaseController;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class StudentController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth:teacher');
    }

    public function getAllStudent()
    {
        
    }
}
