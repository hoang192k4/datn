<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lecture extends Model
{
    protected $fillable = ['id','title','position','file_path','chapter_id','status'];

    public function chapter():BelongsTo
    {
        return $this->belongsTo(Chapter::class);
    }
}
