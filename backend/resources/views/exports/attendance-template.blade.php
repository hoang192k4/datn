<table>
    <thead style="font-weight: bold;">
        <tr>
            <th style="text-align: center;">STT</th>
            <th style="text-align: center;">MSSV</th>
            <th style="text-align: center;">Họ và Tên</th>
            <th style="text-align: center;">Ngày điểm danh</th>
            <th style="text-align: center;">Trạng Thái</th>
            <th style="text-align: center;">Ghi Chú</th>
            <th>Session ID</th>
            <th>Student ID</th>
        </tr>
    </thead>
    <tbody>
        @foreach ($students as $student)
            <tr>
                <td style="text-align: center;">{{ $loop->iteration }}</td>
                <td style="text-align: center;">{{ $student->student_code }}</td>
                <td style="text-align: left;">{{ $student->name }}</td>
                <td style="text-align: center;">{{ $session->study_date }}</td>
                <td>
                   Vắng không phép
                </td>
                <td></td>
                <td>{{ $session->id }}</td>
                <td>{{ $student->id }}</td>
            </tr>
        @endforeach
    </tbody>
</table>
