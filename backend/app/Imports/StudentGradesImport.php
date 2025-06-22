<?php

namespace App\Imports;

use App\Enums\Evaluation;
use App\Models\GradeType;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use App\Services\Grade\GradeServiceInterface;
use Illuminate\Validation\ValidationException;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;

class StudentGradesImport implements ToCollection
{

    protected $courseSectionId;
    protected $gradeTypeMap;
    protected $studentRepository;
    protected $gradeRepository;
    protected $summaryGradeRepository;
    protected $errors = [];

    public function __construct(
        int $courseSectionId
    ) {
        $this->courseSectionId = $courseSectionId;
        $this->gradeTypeMap = GradeType::pluck('id', 'code')->toArray();
        $this->studentRepository = app(StudentRepositoryInterface::class);
        $this->gradeRepository = app(GradeRepositoryInterface::class);
        $this->summaryGradeRepository = app(SummaryGradeRepositoryInterface::class);
    }
    /**
     * @param Collection $collection
     */
    public function collection(Collection $rows)
    {
        //
        $headers = $rows->first()->toArray();
        $rows->shift();

        foreach ($rows as $rowIndex => $row) {
            $data = $row->toArray();
            $studentCode = $data[1];

            $student = $this->studentRepository->findWithConditions(['student_code' => $studentCode]);
            if (!$student) {
                continue;
            }
            foreach ($headers as $index => $header) {
                if ($index === 0 || $index === 2) {
                    continue;
                }

                if (trim($header) === 'TenSV') {
                    continue;
                }
                if (trim($header) == "chuyen_can") {

                    if (!is_numeric($data[$index]) || $data[$index] < 1 || $data[$index] > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$data[$index]' (SV: {$student->student_code}, cột: {$header}, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }
                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'attendance_score' => $data[$index]
                    ]);
                    continue;
                }

                if (trim($header) == "tbkt" || trim($header) == "TBKT") {

                    if (!is_numeric($data[$index]) || $data[$index] < 1 || $data[$index] > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$data[$index]' (SV: {$student->student_code}, cột: {$header}, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }
                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'avg_score' => $data[$index]
                    ]);
                    continue;
                }

                if (trim($header) == "thi_lan_1") {

                    if (!is_numeric($data[$index]) || $data[$index] < 1 || $data[$index] > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$data[$index]' (SV: {$student->student_code}, cột: {$header}, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }
                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'exam1_score' => $data[$index]
                    ]);
                    continue;
                }

                if (trim($header) == "thi_lan_2") {


                    if (!is_numeric($data[$index]) || $data[$index] < 1 || $data[$index] > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$data[$index]' (SV: {$student->student_code}, cột: {$header}, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }
                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'exam2_score' => $data[$index]
                    ]);
                    continue;
                }

                if (trim($header) == "tong_ket") {

                    if (!is_numeric($data[$index]) || $data[$index] < 1 || $data[$index] > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$data[$index]' (SV: {$student->student_code}, cột: {$header}, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }
                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'final_score' => $data[$index]
                    ]);
                    continue;
                }

                if (trim($header) == "danh_gia") {

                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'evaluation' => Evaluation::fromVietnamese($data[$index]),
                    ]);
                    continue;
                }


                if (trim($header) == "ghi_chu") {
                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        'note' => $data[$index]
                    ]);
                    continue;
                }


                if (preg_match('/^([A-Z0-9]+)_([0-9]+)$/', $header, $matchers)) {
                    [$full, $gradeTypeCode, $attempt] = $matchers;

                    if (!isset($this->gradeTypeMap[$gradeTypeCode])) {
                        continue;
                    }

                    $gradeTypeId = $this->gradeTypeMap[$gradeTypeCode];
                    $score = $data[$index];


                    if (!is_numeric($score) || $score < 1 || $score > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$score' (SV: {$student->student_code}, cột: {$header}, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }

                    if ($score === null || $score === '') continue;

                    $this->gradeRepository->updateOrCreate([
                        'student_id' => $student->id,
                        'grade_type_id' => $gradeTypeId,
                        'course_section_id' => $this->courseSectionId,
                        'attempt' => $attempt
                    ], [
                        'score' => $score,
                    ]);
                }
            }
        }

        if (count($this->errors)) {
            throw ValidationException::withMessages(['import' => $this->errors]);
        }
    }
}
