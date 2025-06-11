import { Link } from "react-router-dom";
import './SidebarStudent.css';
const SidebarStudent = () => {
    return (
        <>
            <div className="sidebar-student">
                <Link to="#">📅 Thời Khóa Biểu</Link>
                <Link to="#">📊 Điểm Tổng Kết</Link>
                <Link to="#">🏅 Điểm Rèn Luyện</Link>
            </div>
        </>
    )
}
export default SidebarStudent