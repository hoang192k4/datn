<?php

namespace App\Exports;

use App\Enums\Evaluation;
use App\Models\GradeType;
use App\Repositories\Student\StudentRepositoryInterface;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Mockery\Loader\EvalLoader;

class StudentGradesExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize
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
        $this->attemptsPerType = $this->calculateAttemptsRangePerType($this->students);
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
                    $colName = "{$type->code}_" . ($grade->attempt); // ví dụ: M_1, 15P_2
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

        $base = ['STT', 'MSSV', 'Họ Tên', 'Chuyên Cần'];

        $dynamic = [];
        foreach ($this->gradeTypes as $type) {
            $range = $this->attemptsPerType[$type->id] ?? ['min' => 1, 'max' => 0];
            for ($i = $range['min']; $i <= $range['max']; $i++) {
                $dynamic[] = "{$type->name} - Lần {$i}";
            }
        }

        $summaryCols = ['Trung Bình Kiểm Tra', 'Thi Lần 1', 'Thi Lần 2', 'Tổng Kết', 'Đánh Giá', 'Ghi chú'];

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


    protected function calculateAttemptsRangePerType($students): array
    {
        $attemptsRange = [];

        foreach ($students as $student) {
            foreach ($student->grades as $grade) {
                $typeId = $grade->grade_type_id;

                if (!isset($attemptsRange[$typeId])) {
                    $attemptsRange[$typeId] = [];
                }

                $attemptsRange[$typeId][] = $grade->attempt;
            }
        }

        // Trả về mảng dạng: [grade_type_id => ['min' => x, 'max' => y]]
        foreach ($attemptsRange as $typeId => $attempts) {
            $unique = array_unique($attempts);
            $attemptsRange[$typeId] = [
                'min' => min($unique),
                'max' => max($unique),
            ];
        }

        return $attemptsRange;
    }

    public function styles(Worksheet $sheet)
    {
        $highestColumn = $sheet->getHighestColumn();
        $highestRow = $sheet->getHighestRow();

        // Căn giữa toàn bộ
        $sheet->getStyle("A1:{$highestColumn}{$highestRow}")
            ->getAlignment()
            ->setHorizontal('center')
            ->setVertical('center');

        // Tô đậm header
        return [
            "A1:{$highestColumn}1" => [
                'font' => [
                    'bold' => true,
                ],
            ],
        ];
    }
}
