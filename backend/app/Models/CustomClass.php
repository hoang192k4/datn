<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CustomClass extends Model
{
    //
    use HasFactory;
    protected $table = 'classes';
    protected $fillable = ['id','name','status','teacher_id'];

    public function students():BelongsToMany
    {
        return $this->belongsToMany(Student::class,'class_student','student_id','class_id');
    }

    public function teacher():BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }
}
