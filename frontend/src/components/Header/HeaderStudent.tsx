import { Link } from "react-router-dom";
import './HeaderStudent.css';
import { useDispatch, useSelector } from "react-redux";
import { studentLogout } from "../../services/authStudentService";
import { HttpStatus } from "../../enums/HttpStatus";
import { logout } from "../../store/slices/authSlice";
import { useState } from "react";
const HeaderStudent = () => {
    const [loadingLogoutStudent, setLoadingLogoutStudent] = useState(false);
    const user = useSelector((state: any) => state.auth.user);
    const dispatch = useDispatch();
    const handleStudentLogout = async () => {
        try {
            setLoadingLogoutStudent(true);
            const data = await studentLogout();
            if (data.status === HttpStatus.SUCCESS)
                dispatch(logout());
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingLogoutStudent(false);
        }
    }
    return (
        <>
            {loadingLogoutStudent && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <header className="header-student">
                <h1><Link to="">KHOA CÔNG NGHỆ THÔNG TIN</Link></h1>
                <div className="nav-links-student">
                    <Link to="#">🔔 Thông Báo</Link>
                    <div className="user-menu-student">
                        <button className="user-btn-student">{user && user.name}</button>
                        <div className="dropdown-content-student">
                            <Link to="thong-tin-ca-nhan">Thông Tin Cá Nhân</Link>
                            <Link to="#" onClick={handleStudentLogout}>Đăng Xuất</Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default HeaderStudent