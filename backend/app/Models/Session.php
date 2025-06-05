<?php

namespace App\Models;

use App\Enums\Session\SessionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Session extends Model
{
    //
    use HasFactory;

    protected function casts():array
    {
        return [
            'status' => SessionStatus::class
        ];
    }
}
