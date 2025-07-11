<?php

namespace App\Exports;

use App\Enums\Evaluation;
use App\Enums\SummaryGrade\SummayryGradeEvaluation;
use App\Models\GradeType;
use App\Repositories\Student\StudentRepositoryInterface;
use App\Supports\Log;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use Mockery\Loader\EvalLoader;

class StudentGradesTemplateExport implements FromArray, WithHeadings, WithStyles, ShouldAutoSize, WithEvents
{
    use Log;
    protected $courseSectionId;
    protected $gradeTypes;
    protected $students;
    protected array $attemptsPerType = [];
    protected $columnMap = [
        'attendance_score' => 'Chuyên cần',
        'exam1_score' => 'Thi lần 1',
        'exam2_score' => 'Thi lần 2',
    ];
    protected $selectedColumns = [];
    public function __construct($courseSectionId, $selectedColumns = [])
    {
        $this->selectedColumns = $selectedColumns;
        $this->courseSectionId = $courseSectionId;
        $this->gradeTypes = GradeType::orderBy('id')->get();
        $this->students = app(StudentRepositoryInterface::class)->getStudentsWithGradesAndSummaryByCourseSection($this->courseSectionId);
    }

    public function array(): array
    {
        $isExportingExam2 = in_array('exam2_score', $this->selectedColumns);

        return $this->students->filter(function ($student) use ($isExportingExam2) {

            if ($isExportingExam2) {
                if ($isExportingExam2 && $student->summary_grades->where('course_section_id', $this->courseSectionId)->first()->note == SummayryGradeEvaluation::RETEST) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        })->values()->map(function ($student, $index) {
            $row = [
                'STT' => $index + 1,
                'MSSV' => $student->student_code,
                'TenSV' => $student->name,
            ];
            return $row;
        })->toArray();
    }

    public function headings(): array
    {
        $base = ['STT', 'MSSV', 'Họ Tên'];
        // Thêm chuyên cần

        $headings = [];
        // Thêm các loại điểm
        foreach ($this->selectedColumns as $column) {
            $headings = $this->mapScoreKeyToVietnamese($this->selectedColumns);
        }
        //  dd($this->selectedColumns);
        // dd($headings);
        // Thêm các điểm tổng kết

        return array_merge($base, $headings);
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

    function mapScoreKeyToVietnamese(array $keys): array
    {
        // Các trường cố định
        $staticMap = [
            'attendance_score' => 'Chuyên cần',
            'exam1_score' => 'Thi lần 1',
            'exam2_score' => 'Thi lần 2',
        ];

        // Lấy grade_types: ['kths1' => 'Kiểm tra hệ số 1', ...]
        $gradeTypes = GradeType::all()->mapWithKeys(function ($item) {
            return [strtolower($item->code) => $item->name];
        });

        $result = [];

        foreach ($keys as $key) {
            $keyLower = strtolower($key);

            if (isset($staticMap[$keyLower])) {
                $result[$key] = $staticMap[$keyLower];
            } elseif (preg_match('/^(kths\d)_(\d)$/', $keyLower, $matches)) {
                $gradeCode = $matches[1]; // kths1
                $attempt = $matches[2];   // 1

                $gradeName = $gradeTypes[$gradeCode] ?? strtoupper($gradeCode);
                $result[$key] = "$gradeName - Lần $attempt";
            } else {
                $result[$key] = $key; // fallback nếu không match
            }
        }

        return $result;
    }

    public function afterSheet(AfterSheet $event)
    {
        $dataRowCount = count($this->students);
        $dataEndRow = 1 + $dataRowCount;
        // Khóa hàng tiêu đề (row 1)
        $sheet = $event->sheet->getDelegate();

        $highestColumn = $sheet->getHighestColumn(); // eg: "G"
        $sheet->getStyle('A1:' . $highestColumn . '1')->getProtection()->setLocked(true);

        $sheet->getStyle("A2:A{$dataEndRow}")->getProtection()->setLocked(true);
        $sheet->getStyle("B2:B{$dataEndRow}")->getProtection()->setLocked(true);
        $sheet->getStyle("C2:C{$dataEndRow}")->getProtection()->setLocked(true);

        // Cho phép chỉnh sửa các dòng còn lại
        $sheet->getStyle("D2:{$highestColumn}{$dataEndRow}")->getProtection()->setLocked(false);

        // Bật chế độ bảo vệ sheet
        $sheet->getProtection()->setSheet(true);
        $sheet->getProtection()->setPassword('secret'); // nếu muốn có mật khẩu
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => [$this, 'afterSheet'],
        ];
    }
}
