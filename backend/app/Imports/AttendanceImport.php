<?php

namespace App\Imports;

use App\Models\Attendance;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class AttendanceImport implements ToCollection, WithHeadingRow
{
    public function collection(Collection $collection)
    {

        if ($collection->isEmpty()) {
            throw new \Exception("File không có dữ liệu.");
        }

        foreach ($collection as $row) {
            if ($row->filter()->isEmpty()) {
                continue;
            }
            $studentId = $row['student_id'] ?? null;
            $sessionId = $row['session_id'] ?? null;
            $statusText = $row['trang_thai'] ?? null;
            $note = $row['ghi_chu'] ?? '';

            $statusMap = [
                'Có mặt' => 'present',
                'Đi trễ' => 'late',
                'Vắng có phép' => 'excused_absent',
                'Vắng không phép' => 'absent',
            ];

            $status = $statusMap[$statusText] ?? 'absent';
            if (!$studentId || ! $sessionId)
                throw new \Exception("Thiếu cột student_id hoặc session_id tại dòng ");
            Attendance::updateOrCreate(
                [
                    'student_id' => $studentId,
                    'session_id' => $sessionId
                ],
                [
                    'status' =>  $status,
                    'note' =>   $note ?? ''
                ]
            );
        }
    }
}
