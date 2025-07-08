<?php

namespace App\Imports;

use Log;
use App\Enums\Role;
use App\Enums\Gender;
use Illuminate\Support\Str;
use App\Models\Role as ModelsRole;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Hash;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\WithChunkReading;
use App\Repositories\Teacher\TeacherRepositoryInterface;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\SkipsEmptyRows;

class TeacherImport implements ToCollection, WithHeadingRow, WithChunkReading, WithValidation, SkipsEmptyRows
{
    protected $repository;
    protected $password;
    public function __construct(TeacherRepositoryInterface $repository)
    {
        $this->repository = $repository;
        $this->password = Hash::make('123456');
    }

    public function isEmptyWhen($row): bool
    {
        return collect($row)->filter()->isEmpty();
    }
    public function collection(Collection $collection)
    {
        $genderMap = [
            'Nam' => Gender::Male,
            'Nữ' => Gender::Female
        ];
        $role = [
            'GVBM' => Role::SUBJECT_TEACHER,
            'GVCN' => Role::HOMEROOM_TEACHER,
            'QTKHOA' => Role::FACULTY_ADMIN,
            'QTBOMON' => Role::DEPARTMENT_ADMIN
        ];
        $teachers = [];

        foreach ($collection as $row) {
            if (
                empty($row['ma_giao_vien']) ||
                empty($row['email']) ||
                empty($row['ho_ten']) ||
                empty($row['dia_chi']) ||
                empty($row['ngay_sinh']) ||
                empty($row['gioi_tinh']) ||
                empty($row['vai_tro'])
            ) {
                continue;
            }

            $data = [
                'teacher_code' => $row['ma_giao_vien'],
                'email' => $row['email'],
                'name' => $row['ho_ten'],
                'slug' => Str::slug($row['ho_ten']),
                'password' => $this->password,
                'address' => $row['dia_chi'],
                'date_of_birth' => Carbon::parse(trim($row['ngay_sinh']))->format('Y-m-d'),
                'gender' =>  $genderMap[trim($row['gioi_tinh'])] ?? null,
                'role_id' => optional(ModelsRole::where('name', $role[trim($row['vai_tro'])])->first())->id
            ];
            $teachers[] = $data;
        }

        $this->repository->upsert($teachers, ['teacher_code', 'email']);
    }

    public function chunkSize(): int
    {
        return 300;
    }

    public function rules(): array
    {
        return [
            '*.ma_giao_vien' => 'required|string',
            '*.ho_ten'   => 'required|string',
            '*.email'       => 'required|email',
            '*.ngay_sinh'   => 'required',
            '*.dia_chi'     => 'required|string',
            '*.vai_tro'     => 'required|string|in:GVBM,GVCN,QTKHOA,QTBOMON',
            '*.gioi_tinh'   => 'required|string|in:Nam,Nữ',
        ];
    }


    public function customValidationMessages()
    {
        return [
            '*.ma_giao_vien.required' => 'Cột Mã Giáo Viên là bắt buộc.',
            '*.email.email'   => 'Email không hợp lệ ở một dòng nào đó.',
            '*.gioi_tinh.required' => 'Cột giới tính là bắt buộc.',
            '*.ho_ten.required' => 'Cột họ và tên là bắt buộc.',
            '*.dia_chi.required' => 'Cột địa chỉ là bắt buộc.',
            '*.gioi_tinh.string' => 'Cột giới tính phải là chuỗi.',
            '*.vai_tro.string' => 'Cột ngành học phải là chuỗi.',
            '*.ho_ten.string' => 'Cột họ tên phải là chuỗi.',
            '*.dia_chi.string' => 'Cột địa chỉ phải là chuỗi.',
            '*.ma_giao_vien.string' => 'Cột mã giáo viên phải là chuỗi.',
            '*.email.required' => 'Cột email là bắt buộc.',
            '*.ngay_sinh.required' => 'Cột ngày sinh là bắt buộc.',
            '*.vai_tro.required' => 'Cột vai trò là bắt buộc.',
            '*.gioi_tinh.in' => 'Cột giới tính phải ghi đúng Nam hoặc Nữ',
            '*.vai_tro.in' => 'Cột vai trò phải ghi đúng GVBM, GVCN, QTKHOA, QTBOMON'
        ];
    }
}
