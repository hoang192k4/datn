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