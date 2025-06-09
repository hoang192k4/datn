import { Link } from "react-router-dom"
import './Header.css';

const Header = () => {
    return (
        <>
            <header>
                <nav className="navbar">
                    <Link to="/"><h1>KHOA CÔNG NGHỆ THÔNG TIN</h1></Link>
                    <ul className="nav-links">
                        {/* xuất hiện khi chuyển vào trang giáo viên */}
                        <li className="dropdown"><Link to="/document">Tài Liệu</Link>
                            <ul className="submenu">
                                <li className="dropdown">
                                    <Link to="#">Nhập môn lập trình</Link>
                                </li>
                                <li className="dropdown">
                                    <Link to="#">Cấu trúc dữ liệu giải thuật</Link>
                                </li>
                                <li className="dropdown">
                                    <Link to="#">Lập trình hướng đối tượng</Link>
                                </li>
                                <li className="dropdown">
                                    <Link to="#">Lập trình PHP</Link>
                                </li>
                            </ul>
                        </li>
                        <li className="dropdown"><Link to="/class">Lớp Học</Link>
                            <ul className="submenu">
                                <li className="dropdown">
                                    <Link to="#">Lớp CĐTH22A</Link>
                                </li>
                                <li className="dropdown">
                                    <Link to="#">Lớp CĐTH22B</Link>
                                </li>
                                <li className="dropdown">
                                    <Link to="#">Lớp CĐTH22C</Link>
                                </li>
                                <li className="dropdown">
                                    <Link to="#">Lớp CĐTH22D</Link>
                                </li>
                            </ul>
                        </li>
                        <li><Link to="/schedule">Thời Khóa Biểu</Link></li>
                        <li><Link to="/login">Đăng Nhập</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header