<?php

namespace App\Services\Grade;

use Illuminate\Http\Request;

interface GradeServiceInterface
{
    public function updateOrCreate(Request $request, $id):object|bool;
       public function create(Request $request):object|bool;
}
