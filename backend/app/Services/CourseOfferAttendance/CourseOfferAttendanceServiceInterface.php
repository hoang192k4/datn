<?php

namespace App\Services\CourseOfferAttendance;

use Illuminate\Http\Request;

interface CourseOfferAttendanceServiceInterface
{
   public function storeAttendanceStudents(Request $request);
}