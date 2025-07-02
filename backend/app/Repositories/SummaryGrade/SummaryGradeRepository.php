<?php

namespace App\Repositories\SummaryGrade;

use App\Models\SummaryGrade;
use Illuminate\Support\Facades\DB;
use App\Repositories\EloquentRepository;

class SummaryGradeRepository extends EloquentRepository implements SummaryGradeRepositoryInterface
{
    public function getModel()
    {
        return SummaryGrade::class;
    }

    public function findByStudentSubject($studentId, $subjectId)
    {
        return $this->model->where('student_id', $studentId)
            ->where('subject_id', $subjectId)->orderByDesc('attempt')->first();
    }

    public function findByStudent($studentId)
    {
        $subQuery = DB::table('summary_grades')
            ->select('subject_id', DB::raw('Max(attempt) as attempt'))
            ->where('student_id', $studentId)
            ->groupBy('subject_id');

        $summaryGrades = DB::table('summary_grades as smr')
            ->join('semesters', 'smr.semester_id', '=', 'semesters.id')
            ->join('subjects', 'smr.subject_id', '=', 'subjects.id')
            ->join('course_sections', 'smr.course_section_id', '=', 'course_sections.id')
            ->joinSub($subQuery, 'subq', function ($join) {
                $join->on('smr.subject_id', '=', 'subq.subject_id')
                    ->on('smr.attempt', '=', 'subq.attempt');
            })
            ->select([
                'smr.*',
                'semesters.name as semester_name',
                'semesters.id as semester_id',
                'subjects.name as subject_name',
                'semesters.start_year as start_year',
                'semesters.end_year as end_year',
                'course_sections.name as course_section_name'
            ])
            ->where('smr.student_id', $studentId)->orderBy('semesters.start_year', 'asc')
            ->orderBy('semesters.start_year', 'asc')
            ->orderBy('semesters.end_year', 'asc')
            ->orderBy('semesters.name', 'asc')->get();

        $grouped = $summaryGrades->groupBy('semester_id')->map(function ($items) {
            $first = $items->first();
            return (object)[
                'semester_id' => $first->semester_id,
                'semester_name' => $first->semester_name,
                'start_year' => $first->start_year,
                'end_year' => $first->end_year,
                'summaries' => $items->map(function ($item) {
                    return $item;
                })->values(),
            ];
        })->values();
        return $grouped;
    }
}
