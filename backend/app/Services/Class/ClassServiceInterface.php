<?php

namespace App\Services\Class;

use Illuminate\Http\Request;

interface ClassServiceInterface
{
    public function getListClasses(Request $request);
}
