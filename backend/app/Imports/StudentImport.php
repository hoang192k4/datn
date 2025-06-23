<?php

namespace App\Imports;

use App\Enums\Student\StudentStatus;
use App\Models\Major;
use App\Repositories\Student\StudentRepositoryInterface;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpOffice\PhpSpreadsheet\Shared\Date;

class StudentImport implements ToCollection, WithHeadingRow, WithChunkReading
{

    protected $studentRepository;

    public function __construct()
    {
        $this->studentRepository = app(StudentRepositoryInterface::class);
    }
    /**
     * @param Collection $collection
     */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row) {
            $data = [
                'student_code' => $row['mssv'],
                'name' => $row['ho_ten'],
                'email' => $row['email'],
                'password' => $row['mat_khau'],
                'date_of_birth' => Date::excelToDateTimeObject($row['ngay_sinh'])->format('Y-m-d'),
                'address' => $row['dia_chi'],
                'enrollment_date' => Date::excelToDateTimeObject($row['ngay_nhap_hoc'])->format('Y-m-d'),
                'major_id' => optional(Major::where('name', $row['nganh_hoc'])->first())->id,
                'status' => StudentStatus::fromVietnamese($row['tinh_trang']),
            ];
            $this->studentRepository->updateOrCreate([
                'student_code' => $row['mssv']
            ], $data);
        }
    }

    public function chunkSize(): int
    {
        return 300;
    }
}
