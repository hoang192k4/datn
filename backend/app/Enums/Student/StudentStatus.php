<?php

namespace App\Enums\Student;

enum StudentStatus:string
{
    case Active = 'active';
    case Graduated = 'graduated';
    case Suspended = 'suspended';
    case DroppedOut  = 'dropped_out';
    case Pending = 'pending';
}
