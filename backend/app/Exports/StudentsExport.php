<?php

namespace App\Exports;

use App\Enums\Gender;
use App\Enums\Student\StudentStatus;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Maatwebsite\Excel\Concerns\WithEvents;
use PhpOffice\PhpSpreadsheet\Style\Border;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithHeadings;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use Maatwebsite\Excel\Concerns\FromCollection;
use App\Repositories\Student\StudentRepositoryInterface;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class StudentsExport implements FromCollection, WithHeadings, WithMapping, WithEvents
{

    protected $studentRespository;
    protected ?string $studentStatus;
    public function __construct(StudentRepositoryInterface $studentRepository, ?string $studentStatus = null)
    {
        $this->studentRespository = $studentRepository;
        $this->studentStatus = $studentStatus;
    }
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if (!$this->studentStatus) {
            return $this->studentRespository->getAll();
        }
        return $this->studentRespository->where(['status' => $this->studentStatus]);
    }

    public function headings(): array
    {
        return ['STT', 'MSSV', 'Họ Tên', 'Email', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Thời gian nhập học', 'Thời gian tốt nhgiệp', 'Ngành học', 'Trạng thái'];
    }

    public function map($student): array
    {
        static $stt = 1;
        return [
            $stt++,
            $student->student_code,
            $student->name,
            $student->email,
            format_date($student->date_of_birth, 'Y-m-d'),
            Gender::getDescription($student->gender),
            $student->address,
            $student->enrollment_date,
            $student->graduated_date ? format_date($student->graduated_date) : 'Chưa tốt nghiệp',
            optional($student->major)->name ?? 'Chưa có',
            StudentStatus::getDesciption($student->status),
        ];
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {

                $sheet = $event->sheet->getDelegate();
                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();


                foreach (range('A', $highestColumn) as $col) {
                    $sheet->getColumnDimension($col)->setAutoSize(true);
                }
                $sheet->getDefaultRowDimension()->setRowHeight(20);
                $sheet->getStyle("A1:{$highestColumn}1")->applyFromArray([
                    'font' => ['bold' => true],
                    'fill' => [
                        'fillType' => Fill::FILL_SOLID,
                        'startColor' => ['rgb' => 'F3F3F3'],
                    ],
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],
                ]);

                $sheet->getStyle("A1:{$highestColumn}{$highestRow}")->applyFromArray([
                    'alignment' => [
                        'horizontal' => Alignment::HORIZONTAL_CENTER,
                        'vertical' => Alignment::VERTICAL_CENTER,
                    ],

                ]);

                // ✅ Dropdown cho cột E (Giới tính), từ hàng 2 đến hàng cuối
                for ($row = 2; $row <= $highestRow; $row++) {
                    $validation = $sheet->getCell("F{$row}")->getDataValidation();
                    $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                    $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
                    $validation->setAllowBlank(true);
                    $validation->setShowInputMessage(true);
                    $validation->setShowErrorMessage(true);
                    $validation->setShowDropDown(true);
                    $validation->setFormula1('"Nam,Nữ"'); // Danh sách lựa chọn

                    $statusValidation = $sheet->getCell("K{$row}")->getDataValidation();
                    $statusValidation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                    $statusValidation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
                    $statusValidation->setAllowBlank(true);
                    $statusValidation->setShowDropDown(true);
                    $statusValidation->setFormula1('"Đang học,Đã tốt nghiệp,Bị đình chỉ,Bảo lưu,Thôi học"');
                }

                // ✅ Căn giữa tất cả các ô từ A1 đến E[cuối]
                $sheet->getStyle("A1:J{$highestRow}")
                    ->getAlignment()
                    ->setHorizontal(\PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER)
                    ->setVertical(\PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER);
            },
        ];
    }
}
