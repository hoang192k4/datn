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
use League\CommonMark\Normalizer\SlugNormalizer;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class StudentGradesImport implements ToCollection, WithHeadingRow
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
        $this->gradeTypeMap = collect(GradeType::pluck('id', 'name')->toArray())->mapWithKeys(function ($id, $name) {
            return [Str::upper(generate_slug($name, '_')) => $id]; // Chuyển đổi tên loại điểm thành dạng slug
        })->toArray();
        $this->studentRepository = app(StudentRepositoryInterface::class);
        $this->gradeRepository = app(GradeRepositoryInterface::class);
        $this->summaryGradeRepository = app(SummaryGradeRepositoryInterface::class);
        $this->summaryGradeService = app(SummaryGradeServiceInterface::class);
    }

    public function collection(Collection $rows)
    {

        foreach ($rows as $rowIndex => $row) {
            $row = $row->toArray(); // Vì row là Row object, nên cần toArray()

            $studentCode = $row['mssv'] ?? null;
            if (!$studentCode) continue;

            $student = $this->studentRepository->findWithConditions(['student_code' => $studentCode]);
            if (!$student) {
                $this->errors[] = "Không tìm thấy sinh viên '$studentCode' (dòng " . ($rowIndex + 2) . ")";
                continue;
            }

            foreach ($row as $header => $value) {
                $key = Str::upper(trim($header)); // CHUYEN_CAN, KTHS1_1, etc.

                if (in_array($key, ['STT', 'MSSV', 'HO_TEN'])) {
                    continue;
                }

                // 1. Summary fields
                if (array_key_exists($key, $this->columnMap)) {
                    $field = $this->columnMap[$key];

                    if (in_array($field, ['attendance_score', 'avg_score', 'exam1_score', 'exam2_score', 'final_score'])) {
                        if (!is_numeric($value) || $value < 0 || $value > 10) {
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

                if (preg_match('/^(.+)_LAN_(\d+)$/', $key, $matches)) {
                    [, $gradeTypeName, $attempt] = $matches;
                    if (!isset($this->gradeTypeMap[$gradeTypeName])) {
                        $this->errors[] = "Không xác định được loại điểm '$gradeTypeName' (cột: $header, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }

                    if ($value === null || $value === '') continue;

                    if (!is_numeric($value) || $value < 0 || $value > 10) {
                        $this->errors[] = "Điểm không hợp lệ '$value' (SV: $studentCode, cột: $header, dòng " . ($rowIndex + 2) . ")";
                        continue;
                    }

                    $gradeTypeId = $this->gradeTypeMap[$gradeTypeName];

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
