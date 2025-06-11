import './ClassPage.css';
import { Link } from 'react-router-dom';
const ClassPage = () => {
    return (
        <>
            <div className="class-page container">
                <div className="class-header">
                    <div className="class-name">Lớp: Nhập môn lập trình</div>
                    <div className="buttons">
                        <Link to ="/diem">Điểm</Link>
                        <Link to ="/diem-danh">Điểm Danh </Link>
                    </div>
                </div>

                <div className="student-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã số sinh viên</th>
                                <th>Họ và tên</th>
                                <th>Giới tính</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>20230001</td>
                                <td>Nguyễn Văn A</td>
                                <td>Nam</td>
                            </tr>
                            <tr>
                                <td>20230002</td>
                                <td>Trần Thị B</td>
                                <td>Nữ</td>
                            </tr>
                            <tr>
                                <td>20230003</td>
                                <td>Lê Hữu C</td>
                                <td>Nam</td>
                            </tr>
                            <tr>
                                <td>20230004</td>
                                <td>Phạm Minh D</td>
                                <td>Nam</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ClassPage