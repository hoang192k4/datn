<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Chapter extends Model
{
    protected $fillable = ['id','subject_id','teacher_id','title','position'];

    public function subject():BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function lectures():HasMany
    {
        return $this->hasMany(Lecture::class);
    }
}
