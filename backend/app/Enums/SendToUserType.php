<?php

namespace App\Enums;

enum SendToUserType:string
{
    case AllTeacher = 'all_teacher';
    case AllStudent = 'all_student';
    case All = 'all';
}
