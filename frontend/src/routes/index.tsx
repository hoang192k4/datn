import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/home/HomePage";
import Dashboard from "../pages/dashboard/dashboard";
import AdminLayout from "../components/layout/AdminLayout";

const AppRoutes = () => {
    const userState = useSelector((state: any) => state.auth.isAuthentication);

    return (
        <Routes>
            <Route element={<MainLayout />}>
                {/* Nếu đã đăng nhập, điều hướng khỏi trang login */}
                <Route path="/login" element={userState ? <Navigate to="/" replace /> : <LoginPage />} />
                {/* Trang chủ */}
                <Route path="/" element={userState ? <HomePage /> : <Navigate to="/login" replace />} />
            </Route>

            {/* Route admin chỉ cho phép nếu đã đăng nhập */}
            <Route path="/admin" element={userState ? <AdminLayout /> : <Navigate to="/login" replace />} >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};
export default AppRoutes