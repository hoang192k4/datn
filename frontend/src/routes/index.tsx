import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/login/LoginPage";
import HomePage from "../pages/home/HomePage";
import TeacherLayout from "../components/layout/TeacherLayout";
import { TeacherRoute } from "./TeacherRoute";
import TeacherPage from "../pages/home/TeacherPage";
import DocumentPage from "../pages/document/DocumentPage";
import ClassPage from "../pages/Class/ClassPage";
import SchedulePage from "../pages/schedule/SchedulePage";
import GradePage from "../pages/grade/GradePage";
import AttendancePage from "../pages/attendance/AttendancePage";
import StudentLayout from "../components/layout/StudentLayout";
import { StudentRoute } from "./StudentRoute";
const AppRoutes = () => {
    const isAuthencation = useSelector((state: any) => state.auth.isAuthentication);
    const role = useSelector((state: any) => state.auth.user?.role ?? null);
    return (
        <Routes>

            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={isAuthencation && role === null ? <Navigate to="/students" replace /> :
                    isAuthencation && role !== null ? <Navigate to="/admin" replace /> : < LoginPage />} />
                <Route path="/lehuvinh" element={<TeacherPage />} />
                <Route path="/document" element={<DocumentPage />} />
                <Route path="/class" element={<ClassPage />} />
                <Route path="/schedule" element={<SchedulePage />} />
                <Route path="/grade" element={<GradePage />} />
                <Route path="/attendance" element={<AttendancePage />} />
            </Route>


            <Route path="/students" element={<StudentLayout />}>
                {
                    StudentRoute.map((route, index) => (
                        <Route key={index} path={route.path} element={isAuthencation && role === null ? route.element : <Navigate to="/login" replace />}></Route>
                    ))
                }
            </Route>


            <Route path="/admin" element={<TeacherLayout />} >
                {
                    TeacherRoute.map((route, index) => (
                        <Route key={index} path={route.path} element={isAuthencation && role !== null ? route.element : <Navigate to="/login" replace />} />
                    ))
                }
            </Route>
        </Routes>
    );
};
export default AppRoutes