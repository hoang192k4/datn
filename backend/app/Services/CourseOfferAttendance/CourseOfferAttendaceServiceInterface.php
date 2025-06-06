<?php

namespace App\Servies\CourseOfferAttendance;

interface CourseOfferAttendaceServiceInterface
{
    public function getStudentsByCourseOffer(string $courseOfferId);
}