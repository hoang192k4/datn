<?php

namespace App\Exports;

use App\Enums\Gender;
use App\Enums\Teacher\TeacherStatus;
use App\Models\Teacher;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class TeacherExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize, WithEvents, WithStyles
{
    protected $status;
    protected $roleId;
    public function __construct($data)
    {
        $this->status = $data['status'] ?? null;
        $this->roleId = $data['role_id'] ?? null;
    }
    public function collection()
    {
        $teacher = Teacher::query();
        if ($this->status)
            $teacher->where('status', $this->status);
        if ($this->roleId)
            $teacher->where('role_id', $this->roleId);
        return $teacher->with(['role:id,title'])->get();
    }

    public function headings(): array
    {
        return ['STT', 'Mã Giảng Viên', 'Họ Tên', 'Email', 'Ngày sinh', 'Giới tính', 'Địa chỉ', 'Vai Trò', 'Trạng thái'];
    }

    public function map($teacher): array
    {
        static $stt = 1;
        return [
            $stt++,
            $teacher->teacher_code,
            $teacher->name,
            $teacher->email,
            format_date($teacher->date_of_birth, 'Y-m-d'),
            Gender::getDescription($teacher->gender),
            $teacher->address,
            optional($teacher->role)->title ?? 'Chưa có',
            TeacherStatus::getDescription($teacher->status),
        ];
    }

    public function styles(Worksheet $sheet)
    {
        // In đậm header
        $sheet->getStyle('A1:I1')->getFont()->setBold(true);

        // Màu nền header
        $sheet->getStyle('A1:I1')->getFill()->setFillType('solid')->getStartColor()->setRGB('BDD7EE');

        // Căn giữa header
        $sheet->getStyle('A1:I1')->getAlignment()->setHorizontal('center');
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();

                $highestRow = $sheet->getHighestRow();
                $highestColumn = $sheet->getHighestColumn();
                $cellRange = "A1:{$highestColumn}{$highestRow}";

                // Thêm border toàn bộ bảng
                $sheet->getStyle($cellRange)->getBorders()->getAllBorders()->setBorderStyle(\PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN);

                // Căn giữa STT, Giới tính, Trạng thái
                $sheet->getStyle("A2:A{$highestRow}")->getAlignment()->setHorizontal('center'); // STT
                $sheet->getStyle("F2:F{$highestRow}")->getAlignment()->setHorizontal('center'); // Giới tính
                $sheet->getStyle("I2:I{$highestRow}")->getAlignment()->setHorizontal('center'); // Trạng thái
            },
        ];
    }
}
