<?php

namespace App\Services\Teacher;

use Illuminate\Http\Request;

interface TeacherServiceInterface 
{
    public function create(Request $request);
    public function update($teacher, Request $request);
    public function updateStatus($teacher);
    public function getAllTeachers(Request $request);
} 