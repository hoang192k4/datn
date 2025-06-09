import './AttendancePage.css';
const AttendancePage = () => {
    return (
        <>
            <div className="attendance-page container">
                    <h1>Danh Sách Điểm Danh</h1>
                    <div style={{marginBottom: '15px', fontSize: '16px'}}>
                        ✅ <span className="present">Có mặt</span> &nbsp;&nbsp;
                        ⚠️ <span className="late">Trễ</span> &nbsp;&nbsp;
                        ❌ <span className="absent">Vắng</span> &nbsp;&nbsp;
                        📝 <span className="excused">Vắng có phép</span>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>MSSV</th>
                                <th>Họ tên</th>
                                <th>Buổi 1</th>
                                <th>Buổi 2</th>
                                <th>Buổi 3</th>
                                <th>Buổi 4</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="MSSV">20230001</td>
                                <td data-label="Họ tên">Nguyễn Văn A</td>
                                <td data-label="Buổi 1" className="present">✅</td>
                                <td data-label="Buổi 2" className="late">⚠️</td>
                                <td data-label="Buổi 3" className="absent">❌</td>
                                <td data-label="Buổi 4" className="excused">📝</td>
                            </tr>
                            <tr>
                                <td data-label="MSSV">20230002</td>
                                <td data-label="Họ tên">Trần Thị B</td>
                                <td data-label="Buổi 1" className="excused">📝</td>
                                <td data-label="Buổi 2" className="present">✅</td>
                                <td data-label="Buổi 3" className="present">✅</td>
                                <td data-label="Buổi 4" className="late">⚠️</td>
                            </tr>
                            <tr>
                                <td data-label="MSSV">20230003</td>
                                <td data-label="Họ tên">Lê Hữu C</td>
                                <td data-label="Buổi 1" className="present">✅</td>
                                <td data-label="Buổi 2" className="present">✅</td>
                                <td data-label="Buổi 3" className="present">✅</td>
                                <td data-label="Buổi 4" className="present">✅</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </>
    )
}

export default AttendancePage