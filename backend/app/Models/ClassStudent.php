<?php

namespace App\Models;

use App\Enums\ClassStudent\ClassStudentStatus;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Factories\HasFactory;

class ClassStudent extends Model
{
    //
    use HasFactory;
    protected function casts():array
    {
        return [
            'status' => ClassStudentStatus::class
        ];
    }
}
