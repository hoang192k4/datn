<?php

namespace App\Enums\Class;

enum ClassStatus:string
{
    case InRegister = 'in_register';
    case InProgress = 'in_progress';
    case Completed = 'completed';
}
