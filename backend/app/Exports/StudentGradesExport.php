<?php

namespace App\Exports;

use App\Enums\Evaluation;
use App\Models\GradeType;
use App\Repositories\Student\StudentRepositoryInterface;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Mockery\Loader\EvalLoader;

class StudentGradesExport implements FromArray, WithHeadings, WithStyles
{

    protected $courseSectionId;
    protected $gradeTypes;
    protected $students;
    protected array $attemptsPerType = [];
    public function __construct($courseSectionId)
    {
        $this->courseSectionId = $courseSectionId;
        $this->gradeTypes = GradeType::orderBy('id')->get();
        $this->students = app(StudentRepositoryInterface::class)->getStudentsWithGradesAndSummaryByCourseSection($this->courseSectionId);
        $this->attemptsPerType = $this->calculateMaxAttemptsPerType($this->students);
    }



    public function array(): array
    {

        $data = [];
        $i = 1;
        foreach ($this->students as $student) {

            $row = [
                'STT' => $i,
                'MSSV' => $student->student_code,
                'TenSV' => $student->name,
            ];
            $i++;
            // Tạm để trống để lát thêm chuyên cần ngay sau student_code
            $afterStudentCode = [];

            // --- Thêm các điểm theo loại ---
            foreach ($this->gradeTypes as $type) {

                $grades = $student->grades
                    ->where('grade_type_id', $type->id)
                    ->where('course_section_id', $this->courseSectionId)
                    ->sortBy('attempt');
                foreach ($grades as $index => $grade) {
                    $colName = "{$type->code}_" . ($index + 1); // ví dụ: M_1, 15P_2
                    $afterStudentCode[$colName] = $grade->score;
                }
            }

            // --- Summary Grade ---
            $summary = $student->summary_grades
                ->where('course_section_id', $this->courseSectionId)
                ->first();

            $row['chuyen_can'] = $summary?->attendance_score ?? null;
            $afterStudentCode['tbkt'] = $summary?->avg_score ?? null;
            $afterStudentCode['thi_lan_1'] = $summary?->exam1_score ?? null;
            $afterStudentCode['thi_lan_2'] = $summary?->exam2_score ?? null;
            $afterStudentCode['tong_ket'] = $summary?->final_score ?? null;
            $afterStudentCode['danh_gia'] = Evaluation::getDescription($summary?->evaluation)  ?? null;
            $afterStudentCode['ghi_chu'] = $summary?->note;

            // Ghép lại theo thứ tự:
            $finalRow = array_merge(
                [
                    'STT' => $row['STT'],
                    'MSSV' => $row['MSSV'],
                    'TenSV' => $row['TenSV'],
                    'chuyen_can' => $row['chuyen_can'],
                ],
                $afterStudentCode
            );

            $data[] = $finalRow;
        }

        return $data;
    }

    public function headings(): array
    {

        $base = ['STT', 'MSSV', 'TenSV', 'chuyen_can'];

        $dynamic = [];
        foreach ($this->gradeTypes as $type) {
            $maxAttempt = $this->attemptsPerType[$type->id] ?? 0;
            for ($i = 1; $i <= $maxAttempt; $i++) {
                $dynamic[] = "{$type->code}_{$i}";
            }
        }


        $summaryCols = ['tbkt', 'thi_lan_1', 'thi_lan_2', 'tong_ket', 'danh_gia', 'ghi_chu'];

        return array_merge($base, $dynamic, $summaryCols);
    }



    protected function calculateMaxAttemptsPerType($students): array
    {
        $maxAttempts = [];

        foreach ($students as $student) {
            foreach ($student->grades as $grade) {
                $typeId = $grade->grade_type_id;

                if (!isset($maxAttempts[$typeId])) {
                    $maxAttempts[$typeId] = [];
                }

                $maxAttempts[$typeId][] = $grade->attempt;
            }
        }

        // Lấy max số lần attempt duy nhất mỗi loại
        foreach ($maxAttempts as $typeId => $attempts) {
            $maxAttempts[$typeId] = count(array_unique($attempts));
        }

        return $maxAttempts;
    }

    public function styles(Worksheet $sheet)
    {
        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . $sheet->getHighestRow())
            ->getBorders()->getAllBorders()->setBorderStyle('thin');

        $sheet->getStyle('A1:' . $sheet->getHighestColumn() . $sheet->getHighestRow())
            ->getAlignment()->setHorizontal('center');

        return [
            'A1:' . $sheet->getHighestColumn() . '1' => [
                'font' => [
                    'bold' => true,
                ],
            ],
        ];
    }
}
