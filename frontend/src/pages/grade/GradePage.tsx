
const GradePage = () => {
    return (
        <>
            <div className="grade-page container">
                <h1>Danh Sách Điểm Lớp Nhập Môn Lập Trình</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Mã số sinh viên</th>
                            <th>Họ và tên</th>
                            <th>Điểm giữa kỳ</th>
                            <th>Điểm cuối kỳ</th>
                            <th>Điểm trung bình</th>
                            <th>Xếp loại</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td data-label="MSSV">20230001</td>
                            <td data-label="Họ tên">Nguyễn Văn A</td>
                            <td data-label="Giữa kỳ">7.5</td>
                            <td data-label="Cuối kỳ">8.0</td>
                            <td data-label="TB">7.75</td>
                            <td data-label="Xếp loại">Khá</td>
                        </tr>
                        <tr>
                            <td data-label="MSSV">20230002</td>
                            <td data-label="Họ tên">Trần Thị B</td>
                            <td data-label="Giữa kỳ">8.5</td>
                            <td data-label="Cuối kỳ">9.0</td>
                            <td data-label="TB">8.75</td>
                            <td data-label="Xếp loại">Giỏi</td>
                        </tr>
                        <tr>
                            <td data-label="MSSV">20230003</td>
                            <td data-label="Họ tên">Lê Hữu C</td>
                            <td data-label="Giữa kỳ">6.0</td>
                            <td data-label="Cuối kỳ">5.5</td>
                            <td data-label="TB">5.75</td>
                            <td data-label="Xếp loại">Trung bình</td>
                        </tr>
                        <tr>
                            <td data-label="MSSV">20230004</td>
                            <td data-label="Họ tên">Phạm Minh D</td>
                            <td data-label="Giữa kỳ">9.0</td>
                            <td data-label="Cuối kỳ">9.5</td>
                            <td data-label="TB">9.25</td>
                            <td data-label="Xếp loại">Xuất sắc</td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </>
    )
}

export default GradePage