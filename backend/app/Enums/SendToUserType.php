<?php

namespace App\Enums;

enum SendToUserType:string
{
    case Teacher = 'teacher';
    case Student = 'student';
    case All = 'all';
}
