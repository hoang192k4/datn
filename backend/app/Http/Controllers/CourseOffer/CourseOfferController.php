<?php

namespace App\Http\Controllers\CourseOffer;

use App\Http\Controllers\BaseController;
use App\Models\CourseOffer;
use Illuminate\Http\Request;

class CourseOfferController extends BaseController
{
    public function getStudentsByCourseOffer(string $id)
    {
       
        $couseOffer = CourseOffer::with('students')->find($id); 
        $listStudents = $couseOffer->students;
        return response()->json($listStudents);
    }
}
