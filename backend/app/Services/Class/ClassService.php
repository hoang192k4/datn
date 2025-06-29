<?php

namespace App\Services\Class;

use App\Enums\Class\ClassStatus;
use App\Models\CustomClass;
use Illuminate\Http\Request;

class ClassService implements ClassServiceInterface
{
    public function getListClasses(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['key'] ?? null;

        $query = CustomClass::query();
        if ($key)
            $query->where('name', 'like', '%' . $key . '%');
        $classes = $query->where('status', ClassStatus::InProgress)->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)->appends(['limit' => $limit]);
        return $classes;
    }
}
