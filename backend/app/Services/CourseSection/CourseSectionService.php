<?php

namespace App\Services\CourseSection;

use App\Enums\ClassStudent\ClassStudentStatus;
use Exception;
use App\Supports\Log;
use Illuminate\Http\Request;
use App\Traits\AuthTeacherApi;
use App\Enums\CourseSection\CourseSectionStatus;
use App\Enums\Role;
use App\Models\ClassStudent;
use App\Models\CourseSection;
use App\Models\SummaryGrade;
use App\Repositories\CourseSection\CourseSectionRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use PhpParser\Node\Expr\Throw_;

class CourseSectionService implements CourseSectionServiceInterface
{
    use Log;
    protected $courseSectionRepository;
    protected $summaryGradeRepository;
    use AuthTeacherApi;
    public function __construct(
        CourseSectionRepositoryInterface $courseSectionRepository,
        SummaryGradeRepositoryInterface $summaryGradeRepository
    ) {
        $this->courseSectionRepository = $courseSectionRepository;
        $this->summaryGradeRepository = $summaryGradeRepository;
    }

    public function getCourseSectionByTeacher(Request $request)
    {
        $currentTeacherId = $this->getCurrentTeacherId();
        $teacherCurrentRole = $this->getCurrentTeacherRole();

        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;

        $key = $request->validated()['key'] ?? null;

        if ($teacherCurrentRole === Role::FACULTY_ADMIN || $teacherCurrentRole === Role::DEPARTMENT_ADMIN) {
            return  $this->courseSectionRepository->getList(
                ['status' => ['!=', CourseSectionStatus::InRegister], 'name' => ['like', $key]],
                ['name' => 'asc', 'created_at' => 'desc'],
                [],
                $limit,
                $page
            );
        }

        return  $this->courseSectionRepository->getList(
            ['teacher_id' => $currentTeacherId, 'status' => ['!=', CourseSectionStatus::InRegister], 'name' => ['like', $key]],
            ['name' => 'asc', 'created_at' => 'desc'],
            [],
            $limit,
            $page
        );
    }

    public function detachStudentByCourseSection(Request $request)
    {
        $data = $request->validated();
        $courseSectionId = $data['course_section_id'];
        $studentId = $data['student_id'];
        $courseSection = $this->courseSectionRepository->find($courseSectionId);
        $result = $courseSection->students()->detach([$studentId]);
        if (!$result)
            return false;
        return true;
    }

    public function attachStudentByCourseSection(Request $request)
    {
        $data = $request->validated();
        $courseSectionId = $data['course_section_id'];
        $studentId = $data['student_id'];
        $courseSection = $this->courseSectionRepository->find($courseSectionId);
        $result = $courseSection->students()->syncWithoutDetaching([$studentId]);
        if (!$result)
            return false;
        return true;
    }

    public function handleClassSummaryGrade($classId, $subjectId, $courseSection, $semesterId)
    {
        $query = ClassStudent::query();
        $studentIds =  $query->where('class_id', $classId)->where('status', ClassStudentStatus::Studying)->pluck('student_id');
        $courseSection->students()->syncWithoutDetaching($studentIds);
        $data = [];
        foreach ($studentIds as $studentId) {
            $latestSummary =  $this->summaryGradeRepository->findByStudentSubject($studentId, $subjectId);

            if ($latestSummary) {
                $data[] = [
                    'student_id' => $studentId,
                    'subject_id' => $subjectId,
                    'semester_id' => $semesterId,
                    'attempt' => $latestSummary->attempt + 1,
                    'course_section_id' => $courseSection->id
                ];
            } else {
                $data[] = [
                    'student_id' => $studentId,
                    'subject_id' => $subjectId,
                    'semester_id' => $semesterId,
                    'attempt' => 1,
                    'course_section_id' => $courseSection->id
                ];
            }
        }
        $this->summaryGradeRepository->inserts($data);
    }

    public function create(Request $request)
    {
        $data = $request->validated();
        $classId = $data['class_id'] ?? null;
        $subjectId = $data['subject_id'];
        $semesterId = $data['semester_id'];
        $courseSection = $this->courseSectionRepository->create($data);
        if (!$courseSection)
            return false;
        if ($classId)
            $this->handleClassSummaryGrade($classId, $subjectId, $courseSection, $semesterId);
        return true;
    }

    public function update(Request $request, $courseSectionId)
    {
        DB::beginTransaction();
        try {
            $data = $request->validated();
            $classId = $data['class_id'] ?? null;
            $courseSection = $this->courseSectionRepository->find($courseSectionId);
            $subjectId = $data['subject_id'] ??  $courseSection->subject_id;
            $semesterId = $data['semester_id'] ?? $courseSection->semester_id;

            if ($courseSection->status !== CourseSectionStatus::InRegister) {
                throw ValidationException::withMessages(["Lớp học đã diễn ra không thể cập nhật"]);
            }

            if ($classId && $classId !== $courseSection->class_id) {
                $originClassId = $courseSection->class_id;

                $query = ClassStudent::query();

                $studentIds =  $query->where('class_id', $originClassId)
                    ->where('status', ClassStudentStatus::Studying)->pluck('student_id')->all();

                $courseSection->students()->detach($studentIds);
                $courseSection->summary_grades()->delete();
                $this->handleClassSummaryGrade($classId, $subjectId, $courseSection, $semesterId);
            }

            if ($subjectId !== $courseSection->subject_id) {

                $summaryGrades = $courseSection->summary_grades;
                foreach ($summaryGrades as $summaryGrade) {
                    $studentId = $summaryGrade->student_id;

                    $maxAttempt = $this->summaryGradeRepository->findByStudentSubject($studentId, $subjectId);

                    $newAttempt = $maxAttempt ? $maxAttempt->attempt + 1 : 1;
                    $summaryGrade->update([
                        'subject_id' => $subjectId,
                        'attempt' => $newAttempt,
                        'semester_id' => $semesterId
                    ]);
                }
            }

            if ($semesterId !== $courseSection->semester_id) {
                $summaryGrades = $courseSection->summary_grades;
                foreach ($summaryGrades as $summaryGrade) {
                    $summaryGrade->update([
                        'semester_id' => $semesterId
                    ]);
                }
            }

            $result = $this->courseSectionRepository->update($courseSectionId, $data);
            if (!$result) {
                Db::rollBack();
                return false;
            }
            Db::commit();
            return true;
        } catch (ValidationException $e) {
            throw $e;
        } catch (Exception $e) {
            DB::rollBack();
            $this->logError($e->getMessage(), $e);
            return false;
        }
    }

    public function updateStatus(Request $request, $courseSectionId)
    {
        $data = $request->validated();
        $courseSection = $this->courseSectionRepository->find($courseSectionId);

        if (!$courseSection->schedules()->exists()) {
            throw ValidationException::withMessages(["Lớp $courseSection->name chưa có thời khóa biểu, chưa thể cập nhật trạng thái"]);
        }

        $result = $this->courseSectionRepository->update($courseSectionId, $data);
        if (!$result)
            return false;
        return true;
    }

    public function getCourseSectionByFilter(Request $request)
    {
        $data = $request->validated();
        $limit = $data['limit'] ?? 10;
        $page = $data['page'] ?? 1;
        $key = $data['keyword'] ?? null;
        $status = $data['status'] ?? null;
        $semester_id = $data['semester_id'] ?? null;
        $year = $data['year'] ?? null;

        $query = CourseSection::query();

        if ($status)
            $query->where('status', $status);
        if ($semester_id)
            $query->where('semester_id', $semester_id);
        if ($year)
            $query->whereYear('start_date', $year);
        if ($key)
            $query->where(function ($q) use ($key) {
                $q->where('name', 'like', '%' . $key . '%')
                    ->orWhereHas('subject', function ($q) use ($key) {
                        $q->where('name', 'like', '%' . $key . '%');
                    })
                    ->orWhereHas('teacher', function ($q) use ($key) {
                        $q->where('name', 'like', '%' . $key . '%');
                    });
            });

        $courseSections = $query->orderBy('created_at', 'desc')
            ->paginate($limit, ['*'], 'page', $page)
            ->appends(['limit' => $limit]);

        return $courseSections;
    }
}
