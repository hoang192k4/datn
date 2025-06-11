import { useDispatch, useSelector } from 'react-redux';
import './HeaderAdmin.css';
import { Link } from 'react-router-dom';
import { teacherLogout } from '../../services/authTeacherService';
import { logout } from '../../store/slices/authSlice';
import { getInitials } from '../../utils/stringUtil';
import { HttpStatus } from '../../enums/HttpStatus';
const HeaderAdmin = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const toggleUserDropdown = () => {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown)
            return;
        dropdown.classList.toggle('active');
    }
    const user = useSelector((state: any) => state.auth?.user ?? null);
    const dispatch = useDispatch();
    const handleLogout = () => {
        teacherLogout().
        then((res) => {
            if(res.status === HttpStatus.SUCCESS)
                dispatch(logout());
        }).catch((errors) => console.log(errors));
    }
    return (
        <header>
            <nav className="navbar">
                <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
                <div className="logo"><Link to="dashboard">Khoa Công Nghệ Thông Tin</Link></div>
                <div className="nav-right">
                    <div className="nav-user" onClick={toggleUserDropdown}>
                        <div className="user-avatar">{user && getInitials(user.name)}</div>
                        <span>{user && user.name}</span>


                        <div className="user-dropdown" id="userDropdown">
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">{user && getInitials(user.name)}</div>
                                <div className="dropdown-name">{user && user.name}</div>
                                <div className="dropdown-email">{user && user.email}</div>
                            </div>
                            <div className="dropdown-menu">
                                <Link to="#" className="dropdown-item" >
                                    <span className="dropdown-item-icon">👤</span>
                                    Thông tin cá nhân
                                </Link>
                                <Link to="#" className="dropdown-item">
                                    <span className="dropdown-item-icon">🔑</span>
                                    Đổi mật khẩu
                                </Link>
                                <div className="dropdown-divider"></div>
                                <Link to="#" className="dropdown-item" onClick={handleLogout}>
                                    <span className="dropdown-item-icon">🚪</span>
                                    Đăng xuất
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Sidebar Overlay for Mobile  */}

        </header>



    )
}

export default HeaderAdmin