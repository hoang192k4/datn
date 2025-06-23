<?php

namespace App\Imports;

use App\Enums\Evaluation;
use App\Models\GradeType;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Illuminate\Validation\ValidationException;
use App\Services\Grade\GradeServiceInterface;
use App\Repositories\Grade\GradeRepositoryInterface;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Repositories\SummaryGrade\SummaryGradeRepositoryInterface;
use App\Services\SummaryGrade\SummaryGradeServiceInterface;
use Illuminate\Support\Str;

class StudentGradesImport implements ToCollection
{
    protected $courseSectionId;
    protected $gradeTypeMap;
    protected $studentRepository;
    protected $gradeRepository;
    protected $summaryGradeRepository;
    protected $errors = [];
    protected $columnMap = [
        'CHUYEN_CAN' => 'attendance_score',
        'TBKT'       => 'avg_score',
        'THI_LAN_1'  => 'exam1_score',
        'THI_LAN_2'  => 'exam2_score',
        'TONG_KET'   => 'final_score',
        'DANH_GIA'   => 'evaluation',
        'GHI_CHU'    => 'note',
    ];

    protected $summaryGradeService;

    public function __construct(int $courseSectionId)
    {
        $this->courseSectionId = $courseSectionId;
        $this->gradeTypeMap = GradeType::pluck('id', 'code')->toArray();
        $this->studentRepository = app(StudentRepositoryInterface::class);
        $this->gradeRepository = app(GradeRepositoryInterface::class);
        $this->summaryGradeRepository = app(SummaryGradeRepositoryInterface::class);
        $this->summaryGradeService = app(SummaryGradeServiceInterface::class);
    }

    public function collection(Collection $rows)
    {
        $headers = $rows->first()->toArray();
        $rows->shift(); // remove header row

        foreach ($rows as $rowIndex => $row) {
            $data = $row->toArray();
            $studentCode = $data[1] ?? null;

            if (!$studentCode) continue;

            $student = $this->studentRepository->findWithConditions(['student_code' => $studentCode]);
            if (!$student) {
                $this->errors[] = "Không tìm thấy sinh viên '$studentCode' (dòng " . ($rowIndex + 2) . ")";
                continue;
            }

            foreach ($headers as $index => $header) {
                $key = Str::upper(trim($header));
                $value = $data[$index] ?? null;

                if (in_array($key, ['stt', 'mssv', 'tensv'])) {
                    continue; // bỏ qua các cột không xử lý
                }

                // 1. Summary fields
                if (array_key_exists($key, $this->columnMap)) {
                    $field = $this->columnMap[$key];

                    if (in_array($field, ['attendance_score', 'avg_score', 'exam1_score', 'exam2_score', 'final_score'])) {
                        if (!is_numeric($value) || $value < 1 || $value > 10) {
                            $this->errors[] = "Điểm không hợp lệ '$value' (SV: $studentCode, cột: $header, dòng " . ($rowIndex + 2) . ")";
                            continue;
                        }
                    }

                    $this->summaryGradeRepository->updateOrCreate([
                        'course_section_id' => $this->courseSectionId,
                        'student_id' => $student->id,
                    ], [
                        $field => $field === 'evaluation' ? Evaluation::fromVietnamese($value) : $value
                    ]);

                    continue;
                }

                // 2. Grade chi tiết theo kiểu điểm và lần chấm (KTHS1_1, KTHS2_2, ...)
                if (preg_match('/^([A-Z0-9]+)_([0-9]+)$/', $key, $matches)) {
                    [$full, $gradeTypeCode, $attempt] = $matches;
                    if (!isset($this->gradeTypeMap[$gradeTypeCode])) {
                        $this->errors[] = "Không xác định được loại điểm '$gradeTypeCode' (cột: $header, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }

                    if ($value === null || $value === '') continue;

                    if (!is_numeric($value) || $value < 1 || $value > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$value' (SV: $studentCode, cột: $header, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }

                    $gradeTypeId = $this->gradeTypeMap[$gradeTypeCode];

                    $this->gradeRepository->updateOrCreate([
                        'student_id' => $student->id,
                        'grade_type_id' => $gradeTypeId,
                        'course_section_id' => $this->courseSectionId,
                        'attempt' => $attempt
                    ], [
                        'score' => $value
                    ]);
                }
            }
        }

        if (count($this->errors)) {
            throw ValidationException::withMessages(['import' => $this->errors]);
        }
        $this->summaryGradeService->updateSummaryGrades($this->courseSectionId);
    }
}
