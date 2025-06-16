<?php

namespace App\Models;

use App\Enums\Subject\SubjectStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    //
    use HasFactory;

    protected $fillable = [
        'name',
        'id',
        'credit',
    ];

    protected function casts(): array
    {
        return [
            'status' => SubjectStatus::class,
        ];
    }

    public function teachers():BelongsToMany
    {
        return $this->belongsToMany(Teacher::class,'teacher_subject');
    }

    public function chapters():HasMany
    {
        return $this->hasMany(Chapter::class);
    }
}
