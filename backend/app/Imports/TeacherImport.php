<?php

namespace App\Imports;

use Log;
use App\Enums\Role;
use App\Enums\Gender;
use Illuminate\Support\Str;
use App\Models\Role as ModelsRole;
use Illuminate\Support\Collection;
use PhpOffice\PhpSpreadsheet\Shared\Date;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use App\Repositories\Teacher\TeacherRepositoryInterface;

class TeacherImport implements ToCollection, WithHeadingRow
{
    protected $repository;
    public function __construct(TeacherRepositoryInterface $repository)
    {
        $this->repository = $repository;
    }


    public function collection(Collection $collection)
    {
        $genderMap = [
            'nam' => Gender::Male,
            'nữ' => Gender::Female
        ];
        $role = [
            'giáo viên bộ môn' => Role::SUBJECT_TEACHER,
            'giáo viên chủ nhiệm' => Role::HOMEROOM_TEACHER,
            'cấp khoa' => Role::FACULTY_ADMIN,
            'cấp bộ môn' => Role::DEPARTMENT_ADMIN
        ];

        foreach ($collection as $row) {
            if (empty($row['ma_giao_vien'])) {
                continue;
            }
            $data = [
                'teacher_code' => $row['ma_giao_vien'],
                'email' => $row['email'],
                'name' => $row['ho_va_ten'],
                'slug' => Str::slug($row['ho_va_ten']),
                'password' => $row['mat_khau'],
                'address' => $row['dia_chi'],
                'date_of_birth' => Date::excelToDateTimeObject($row['ngay_sinh'])->format('Y-m-d'),
                'gender' =>  $genderMap[trim(mb_strtolower($row['gioi_tinh']))] ?? null,
                'role_id' => optional(ModelsRole::where('name', $role[trim(mb_strtolower($row['vai_tro']))])->first())->id
            ];
            $this->repository->updateOrCreate([
                'teacher_code' => $row['ma_giao_vien'],
            ], $data);
        }
    }
}
