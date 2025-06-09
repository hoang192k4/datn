import { Link } from "react-router-dom"
import './Header.css';

const Header = () => {
    return (
        <>
            <header>
                <nav className="navbar">
                    <Link to="/"><h1>KHOA CÔNG NGHỆ THÔNG TIN</h1></Link>
                    <ul className="nav-links">
                        <li><Link to="/login">Đăng Nhập</Link></li>
                    </ul>
                </nav>
            </header>
        </>
    )
}

export default Header