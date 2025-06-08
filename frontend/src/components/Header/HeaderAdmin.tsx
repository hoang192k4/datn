import './HeaderAdmin.css';
import { Link } from 'react-router-dom';
const HeaderAdmin = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const toggleUserDropdown = () => {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown)
            return;
        dropdown.classList.toggle('active');
    }
    return (
        <header>
            <nav className="navbar">
                <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
                <div className="logo"><Link to="dashboard">Khoa Công Nghệ Thông Tin</Link></div>
                <div className="nav-right">
                    <div className="nav-user" onClick={toggleUserDropdown}>
                        <div className="user-avatar">NM</div>
                        <span>Đăng Nhập</span>


                        <div className="user-dropdown" id="userDropdown">
                            <div className="dropdown-header">
                                <div className="dropdown-avatar">NM</div>
                                <div className="dropdown-name">Nguyễn Văn Minh</div>
                                <div className="dropdown-email">nguyenvanminh@university.edu.vn</div>
                            </div>
                            <div className="dropdown-menu">
                                <a href="#" className="dropdown-item" >
                                    <span className="dropdown-item-icon">👤</span>
                                    Thông tin cá nhân
                                </a>
                                <a href="#" className="dropdown-item">
                                    <span className="dropdown-item-icon">🔑</span>
                                    Đổi mật khẩu
                                </a>
                                <div className="dropdown-divider"></div>
                                <a href="#" className="dropdown-item">
                                    <span className="dropdown-item-icon">🚪</span>
                                    Đăng xuất
                                </a>
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