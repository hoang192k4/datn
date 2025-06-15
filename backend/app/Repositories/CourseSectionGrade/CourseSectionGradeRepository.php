<?php

namespace App\Repositories\CourseSectionGrade;

use App\Models\CourseSection;
use Illuminate\Support\Facades\DB;
use App\Repositories\EloquentRepository;

class CourseSectionGradeRepository extends EloquentRepository implements CourseSectionGradeRepositoryInterface
{

    protected $gradeTable = 'grades';
    public function getModel()
    {
        return CourseSection::class;
    }

    public function deleteGradeColumn($courseSectionId, $gradeTypeId, $attempt): bool
    {
        return DB::table($this->gradeTable)
            ->where('course_section_id', $courseSectionId)
            ->where('grade_type_id', $gradeTypeId)
            ->where('attempt', $attempt)->delete() > 0;
    }
}
