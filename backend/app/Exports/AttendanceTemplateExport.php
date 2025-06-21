<?php

namespace App\Exports;


use App\Enums\Student\StudentStatus;
use App\Models\Session;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Protection;

class AttendanceTemplateExport implements FromView, WithEvents
{
    protected $sessionId;

    public function __construct($sessionId)
    {
        $this->sessionId = $sessionId;
    }

    public function view(): View
    {
        $session = Session::with([
            'schedule.course_section.students' => function ($query) {
                $query->where('status', StudentStatus::Active);
            }
        ])->findOrFail($this->sessionId);

        return view('exports.attendance-template', [
            'students' => $session->schedule->course_section->students,
            'session' => $session,
        ]);
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                // ⚙️ Tạo dropdown cho cột E (Status)
                $validation = $event->sheet->getDelegate()->getCell('E2')->getDataValidation();
                $validation->setType(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::TYPE_LIST);
                $validation->setErrorStyle(\PhpOffice\PhpSpreadsheet\Cell\DataValidation::STYLE_STOP);
                $validation->setAllowBlank(false);
                $validation->setShowInputMessage(true);
                $validation->setShowErrorMessage(true);
                $validation->setShowDropDown(true);
                $validation->setFormula1('"Có mặt,Đi trễ,Vắng có phép,Vắng không phép"');

                // Áp dụng dropdown cho nhiều dòng
                for ($row = 2; $row <= 100; $row++) {
                    $cell = 'E' . $row;
                    $event->sheet->getDelegate()->getCell($cell)->setDataValidation(clone $validation);
                }

                $sheet = $event->sheet->getDelegate();
                $sheet->getProtection()->setSheet(true);
                $sheet->getProtection()->setPassword('your-strong-password'); // Có thể bỏ nếu không cần mật khẩu

                // 🔓 Cho phép chỉnh sửa cột E và F (Status và Note)
                for ($row = 2; $row <= 100; $row++) {
                    // Cột E (Status)
                    $sheet->getStyle('E' . $row)
                        ->getProtection()
                        ->setLocked(Protection::PROTECTION_UNPROTECTED);

                    // Cột F (Note)
                    $sheet->getStyle('F' . $row)
                        ->getProtection()
                        ->setLocked(Protection::PROTECTION_UNPROTECTED);
                }
                // 🔒 Ẩn cột Session ID (G)
                $event->sheet->getDelegate()->getColumnDimension('G')->setVisible(false);
                $event->sheet->getDelegate()->getColumnDimension('H')->setVisible(false);

                // 🎨 Định dạng header (A1:G1)
                $event->sheet->getStyle('A1:G1')->getFont()->setBold(true);
                $event->sheet->getStyle('A1:G1')->getAlignment()->setHorizontal('center');

                // 🧩 Auto-size cột
                foreach (range('A', 'G') as $col) {
                    $event->sheet->getDelegate()->getColumnDimension($col)->setAutoSize(true);
                }
            },
        ];
    }
}
