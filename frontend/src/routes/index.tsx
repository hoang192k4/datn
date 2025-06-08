import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/Login/LoginPage";
import HomePage from "../pages/home/HomePage";
import Dashboard from "../pages/dashboard/dashboard";
import AdminLayout from "../components/layout/AdminLayout";
const AppRoutes = () => {

    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route path="/admin" element={<AdminLayout />} >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="" element={<Dashboard />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes