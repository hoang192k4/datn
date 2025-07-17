import { Link, useNavigate } from "react-router-dom";
import './HeaderStudent.css';
import { useDispatch, useSelector } from "react-redux";
import { studentLogout } from "../../services/authStudentService";
import { HttpStatus } from "../../enums/HttpStatus";
import { logout } from "../../store/slices/authSlice";
import { useEffect, useState } from "react";
import Loadding from "../ui/Loadding";
import { onMessage } from "firebase/messaging";
import { messaging } from "../../config/firebase";
import { toast, ToastContainer } from "react-toastify";
import { incrementUnread, setUnreadCount } from "../../store/slices/notiSlice";
import { getNotifications } from "../../services/notificationService";
import { NotificationType } from "../../enums/NotificationType";
const HeaderStudent = () => {
    const [loadingLogoutStudent, setLoadingLogoutStudent] = useState(false);
    const user = useSelector((state: any) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleStudentLogout = async () => {
        try {
            setLoadingLogoutStudent(true);
            const data = await studentLogout();
            if (data.status === HttpStatus.SUCCESS) {
                navigate("/dang-nhap-sinh-vien", { replace: true });
                dispatch(logout());
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoadingLogoutStudent(false);
        }
    }
    const unreadCount = useSelector((state: any) => state.noti.unreadCount);
    useEffect(() => {
        const unsubscribe = onMessage(messaging, (payload) => {
            const { title, body, icon, click_action }: any = payload.data;
            toast.info('Thông báo mới: ' + title);
            dispatch(incrementUnread());
            // Hiện thông báo nếu có quyền
            if (Notification.permission === 'granted') {
                new Notification(title, {
                    body: body,
                    icon: icon || '/logo192.png',
                    tag: 'fcm-foreground',
                    data: {
                        click_action: click_action || '/',
                    },
                });
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    useEffect(() => {
        async function fetchNotifications() {
            const response = await getNotifications({ limit: null }, NotificationType.TeacherSend);
            const notifications = response.data;
            const unreadCount = notifications.filter((n: any) => n.status === "unread").length;
            dispatch(setUnreadCount(unreadCount));
        }

        fetchNotifications();
    }, []);
    return (
        <>
            {loadingLogoutStudent && <Loadding />}
            <ToastContainer />
            <header className="header-student">
                <h1><Link to="">KHOA CÔNG NGHỆ THÔNG TIN</Link></h1>
                <div className="notification-bell-student" style={{ marginLeft: '65%' }}>
                    <Link to="thong-bao">
                        <svg className="bell-icon" viewBox="0 0 24 24">
                            <path d="M12 2C13.1 2 14 2.9 14 4C14 4.78 13.64 5.47 13.06 5.85C15.84 6.82 18 9.38 18 12.5V16L20 18V19H4V18L6 16V12.5C6 9.38 8.16 6.82 10.94 5.85C10.36 5.47 10 4.78 10 4C10 2.9 10.9 2 12 2ZM12 22C13.11 22 14 21.11 14 20H10C10 21.11 10.89 22 12 22Z" />
                        </svg>
                        {unreadCount === 0 ? <> </> : <span className="notification-badge"> {unreadCount} </span>}
                    </Link>
                </div>
                <div className="nav-links-student">
                    <div className="user-menu-student">
                        <button className="user-btn-student">{user && user.name}</button>
                        <div className="dropdown-content-student">
                            <Link to="thong-tin-ca-nhan">Thông Tin Cá Nhân</Link>
                            <Link to="doi-mat-khau">
                                
                                Đổi mật khẩu
                            </Link>
                            <Link to="#" onClick={handleStudentLogout}>Đăng Xuất</Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}

export default HeaderStudent