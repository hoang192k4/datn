<?php

namespace App\Services\Class;

use Illuminate\Http\Request;

interface ClassServiceInterface
{
    public function getListClasses(Request $request);
    public function getListClassesFilter(Request $request);
    public function update(Request $request, string $classId);
}
