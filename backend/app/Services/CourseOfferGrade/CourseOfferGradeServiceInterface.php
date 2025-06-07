<?php

namespace App\Services\CourseOfferGrade;

use Illuminate\Http\Request;

interface CourseOfferGradeServiceInterface
{
    public function getGradesByStudentAndCourseOffer(Request $request);
    public function addGradeColumn(Request $request);
}
