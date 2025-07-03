<?php

namespace App\Models;

use App\Enums\Notification\NotificationStatus;
use App\Enums\Notification\NotificationType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    //
    use HasFactory;

    protected $fillable = ['id', 'teacher_id', 'teacher_receive_id', 'student_id', 'title', 'content', 'type', 'status', 'post_id'];

    protected function casts(): array
    {
        return [
            'status' => NotificationStatus::class,
            'type' => NotificationType::class,
        ];
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(Teacher::class);
    }

    public function teacher_receive(): BelongsTo
    {
        return $this->belongsTo(Teacher::class, 'teacher_receive_id', 'id');
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
