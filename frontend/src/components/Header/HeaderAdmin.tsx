import { useDispatch, useSelector } from 'react-redux';
import './HeaderAdmin.css';
import { Link } from 'react-router-dom';
import { teacherLogout } from '../../services/authTeacherService';
import { logout } from '../../store/slices/authSlice';
import { getInitials } from '../../utils/utils';
import { HttpStatus } from '../../enums/HttpStatus';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loadding from '../ui/Loadding';
import { messaging } from '../../config/firebase';
import { onMessage } from 'firebase/messaging';
import { ToastContainer, toast } from 'react-toastify';

const HeaderAdmin = ({ toggleSidebar }: { toggleSidebar: () => void }) => {
    const [loadingLogout, setLoadingLogout] = useState(false);
    const [totalNotificationsUnread, setTotalNotificationsUnread] = useState<number>(0);
    const toggleUserDropdown = () => {
        const dropdown = document.getElementById('userDropdown');
        if (!dropdown)
            return;
        dropdown.classList.toggle('active');
    }
    const user = useSelector((state: any) => state.auth?.user ?? null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            setLoadingLogout(true);
            const data = await teacherLogout();
            if (data.status === HttpStatus.SUCCESS) {
                navigate("/dang-nhap-giang-vien", { replace: true });
                dispatch(logout());
            }
        } catch (errors) {
            console.log(errors);
        } finally {
            setLoadingLogout(false);
        }
    }


    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('🔔 Thông báo mới:', payload);

            toast.info("Thông báo mới: " + payload.data?.title)
            setTotalNotificationsUnread(prev => prev + 1);
        });

        return () => {
            unsubscribe(); // Clean up khi component bị hủy
        };
    }, []);

    return (
        <header>
            <ToastContainer />
            {loadingLogout && <Loadding />}
            <nav className="navbar">
                <button className="mobile-toggle" onClick={toggleSidebar}>☰</button>
                <div className="logo"><Link to="dashboard">Khoa Công Nghệ Thông Tin</Link></div>
                <div className="nav-right">
                    <div className="notification-bell">
                        <Link to="thong-bao/khoa-va-sinh-vien">
                            <svg className="bell-icon" viewBox="0 0 24 24">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 4.78 13.64 5.47 13.06 5.85C15.84 6.82 18 9.38 18 12.5V16L20 18V19H4V18L6 16V12.5C6 9.38 8.16 6.82 10.94 5.85C10.36 5.47 10 4.78 10 4C10 2.9 10.9 2 12 2ZM12 22C13.11 22 14 21.11 14 20H10C10 21.11 10.89 22 12 22Z" />
                            </svg>
                            {totalNotificationsUnread === 0 ? <> </> : <span className="notification-badge"> {totalNotificationsUnread} </span>}
                        </Link>
                    </div>

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
                                <Link to="thong-tin-ca-nhan" className="dropdown-item" >
                                    <span className="dropdown-item-icon">👤</span>
                                    Thông tin cá nhân
                                </Link>
                                <Link to="doi-mat-khau" className="dropdown-item">
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
        </header >



    )
}

export default HeaderAdmin