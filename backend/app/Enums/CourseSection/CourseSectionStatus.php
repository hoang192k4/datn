<?php

namespace App\Enums\CourseSection;

enum CourseSectionStatus: string
{
    case InRegister = 'in_register';
    case InProgress = 'in_progress';
    case Completed = 'completed';
}
