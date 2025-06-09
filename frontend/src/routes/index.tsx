import { Routes, Route, Navigate } from "react-router-dom"
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/login/LoginPage";
import HomePage from "../pages/home/HomePage";
import AdminLayout from "../components/layout/AdminLayout";
import { AdminRoute } from "./AdminRoute";
import TeacherPage from "../pages/home/TeacherPage";
import DocumentPage from "../pages/document/DocumentPage";
import ClassPage from "../pages/Class/ClassPage";
import SchedulePage from "../pages/schedule/SchedulePage";
import GradePage from "../pages/grade/GradePage";
import AttendancePage from "../pages/attendance/AttendancePage";
const AppRoutes = () => {
    return (
        <Routes>

            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/lehuvinh" element={<TeacherPage />} />
                <Route path="/document" element={<DocumentPage />} />
                <Route path="/class" element={<ClassPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/grade" element={<GradePage />} />
                 <Route path="/attendance" element={<AttendancePage />} />

            </Route>

            <Route path="/admin" element={<AdminLayout />} >
                {
                    AdminRoute().map((route, index) => (
                        <Route key={index} path={route.path} element={route.element} />
                    ))
                }
            </Route>
        </Routes>
    )
}

export default AppRoutes