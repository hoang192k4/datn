<?php 

namespace App\Repositories\CourseOfferAttendance;

use Illuminate\Http\Request;
use App\Repositories\EloquentRepositoryInterface;

interface CourseOfferAttendanceRepositoryInterface extends EloquentRepositoryInterface
{
    public function storeAttendanceStudents($session_id, $attendanceStudents);
}