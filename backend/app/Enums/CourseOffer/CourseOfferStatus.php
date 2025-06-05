<?php

namespace App\Enums\CourseOffer;

enum CourseOfferStatus: string
{
    case InRegister = 'in_register';
    case InProgress = 'in_progress';
    case Completed = 'completed';
}
