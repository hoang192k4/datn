<?php

namespace App\Imports;

use App\Enums\Gender;
use App\Enums\Student\StudentStatus;
use App\Models\Major;
use App\Repositories\Student\StudentRepositoryInterface;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\WithValidation;

class StudentImport implements ToCollection, WithHeadingRow, WithChunkReading, WithValidation
{

    protected $studentRepository;
    protected $majorMap;
    protected $password;

    public function __construct()
    {
        $this->studentRepository = app(StudentRepositoryInterface::class);
        $this->majorMap =  Major::pluck('id', 'name')->toArray();
        $this->password = Hash::make('123456');
    }
    /**
     * @param Collection $collection
     */
    public function collection(Collection $rows)
    {
        $students = [];

        foreach ($rows as $row) {
            if (
                empty($row['mssv']) ||
                empty($row['ho_ten']) ||
                empty($row['email']) ||
                empty($row['ngay_sinh']) ||
                empty($row['dia_chi']) ||
                empty($row['thoi_gian_nhap_hoc']) ||
                empty($row['nganh_hoc']) ||
                empty($row['gioi_tinh'])
            ) {

                continue;
            }

            $data = [
                'student_code' => trim($row['mssv']),
                'name' => trim($row['ho_ten']),
                'email' => trim($row['email']),
                'password' => $this->password,
                'date_of_birth' => Carbon::parse(trim($row['ngay_sinh']))->format('Y-m-d'),
                'address' => trim($row['dia_chi']),
                'enrollment_date' => Carbon::parse(trim($row['thoi_gian_nhap_hoc']))->format('Y-m-d'),
                'major_id' => $this->majorMap[$row['nganh_hoc']] ?? null,
                'status' => StudentStatus::fromVietnamese($row['trang_thai'] ?? '') ?? StudentStatus::Active,
                'gender' => Gender::fromVietnamese($row['gioi_tinh']),
            ];
            $students[] = $data;
        }

        $this->studentRepository->upsert($students, ['student_code', 'email']);
    }

    public function chunkSize(): int
    {
        return 300;
    }


    public function rules(): array
    {
        return [
            '*.mssv'          => 'required|string',
            '*.ho_ten'        => 'required|string',
            '*.email'         => 'required|email',
            '*.ngay_sinh'     => 'required|string|date_format:Y-m-d',
            '*.dia_chi'       => 'required|string',
            '*.thoi_gian_nhap_hoc' => 'required|string|date_format:Y-m-d',
            '*.nganh_hoc'     => 'required|string',
            '*.gioi_tinh' => 'required|string',
        ];
    }


    public function customValidationMessages()
    {
        return [
            '*.mssv.required' => 'Cột MSSV là bắt buộc.',
            '*.email.email'   => 'Email không hợp lệ ở một dòng nào đó.',
            '*.nganh_hoc.required' => 'Cột ngành học là bắt buộc.',
            '*.gioi_tinh.required' => 'Cột giới tính là bắt buộc.',
            '*.ho_ten.required' => 'Cột họ tên là bắt buộc.',
            '*.dia_chi.required' => 'Cột địa chỉ là bắt buộc.',
            '*.gioi_tinh.string' => 'Cột giới tính phải là chuỗi.',
            '*.nganh_hoc.string' => 'Cột ngành học phải là chuỗi.',
            '*.ho_ten.string' => 'Cột họ tên phải là chuỗi.',
            '*.dia_chi.string' => 'Cột địa chỉ phải là chuỗi.',
            '*.mssv.string' => 'Cột MSSV phải là chuỗi.',
            '*.email.required' => 'Cột email là bắt buộc.',
            '*.ngay_sinh.required' => 'Cột ngày sinh là bắt buộc.',
            '*.thoi_gian_nhap_hoc.required' => 'Cột ngày nhập học là bắt buộc.',
        ];
    }
}
