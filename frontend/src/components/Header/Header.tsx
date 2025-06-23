import { Link } from "react-router-dom"
import './Header.css';
import { useSelector } from "react-redux";
import { Role } from "../../enums/Role";

const Header = () => {
    const isAuthencation = useSelector((state: any) => state.auth.isAuthentication);
    const user = useSelector((state: any) => state.auth.user);
    return (
        <>
            <header>
                <nav className="navbar">
                    <Link to="/"><h1>KHOA CÔNG NGHỆ THÔNG TIN</h1></Link>
                    <ul className="nav-links">
                        {/* xuất hiện khi chuyển vào trang giáo viên */}
                        <li className="dropdown"><Link to="/tai-lieu">Tài Liệu</Link>
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
                        <li className="dropdown"><Link to="/lop-hoc">Lớp Học</Link>
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
                        <li><Link to="/thoi-khoa-bieu">Thời Khóa Biểu</Link></li>
                        {!isAuthencation && <li><Link to="/dang-nhap">Đăng Nhập</Link></li>}

                        {isAuthencation && user?.role === Role.Teacher ?
                            <li><Link to={`/${user?.slug}`}>{user?.name && user.name}</Link></li> :
                            <li><Link to="/sinh-vien">{user?.name && user.name}</Link></li>
                        }

                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header