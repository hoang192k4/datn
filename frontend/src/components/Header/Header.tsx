import { Link } from "react-router-dom"
import './Header.css';
import { useSelector } from "react-redux";

const Header = () => {
    const isAuthencation = useSelector((state: any) => state.auth.isAuthentication);
    const user = useSelector((state: any) => state.auth.user);
    return (
        <>
            <header>
                <nav className="navbar">
                    <Link to="/"><h1>KHOA CÔNG NGHỆ THÔNG TIN</h1></Link>
                    <ul className="nav-links">
                        {!isAuthencation && <li className="dropdown-login" ><Link to="#">Đăng Nhập</Link>
                            <div className="dropdown-login-menu">
                                <Link to="dang-nhap-sinh-vien">Sinh viên</Link>
                                <Link to="dang-nhap-giang-vien">Giảng viên</Link>
                            </div>
                        </li>}

                        {isAuthencation && user?.role ?
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