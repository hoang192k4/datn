<?php

namespace App\Enums\Student;

enum StudentStatus:string
{
    case Active = 'active';
    case Graduated = 'graduated';
    case Suspended = 'suspended';
    case Propped  = 'Propped';
}
