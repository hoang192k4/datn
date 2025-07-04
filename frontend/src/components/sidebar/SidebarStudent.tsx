import { Link } from "react-router-dom";
import './SidebarStudent.css';
const SidebarStudent = () => {
    return (
        <>
            <div className="sidebar-student">
                <Link to="thoi-khoa-bieu">📅 Thời Khóa Biểu</Link>
                <Link to="diem-tong-ket">📊 Điểm Tổng Kết</Link>
                <Link to="diem-ren-luyen">🏅 Điểm Rèn Luyện</Link>
                <Link to="thong-bao">🏅 Thông báo</Link>
            </div>
        </>
    )
}
export default SidebarStudent