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
import NotFoundPage from "../pages/notfound/NotFoundPage";
const AppRoutes = () => {
    const isAuthencation = useSelector((state: any) => state.auth.isAuthentication);
    const role = useSelector((state: any) => state.auth.user?.role ?? null);

    const slugTeacher = useSelector((state: any) => state.auth.user?.slug ?? null);
    return (
        <Routes>
            {/* Route public */}
            <Route element={<MainLayout />}>
                <Route path="/:slug" element={<TeacherPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/dang-nhap" element={isAuthencation && role === null ? <Navigate to="/sinh-vien" replace /> :
                    isAuthencation && role !== null ? <Navigate to={slugTeacher !== null ? `/${slugTeacher}` : '/giang-vien'} replace /> : < LoginPage />} />

                <Route path="/tai-lieu" element={<DocumentPage />} />
                <Route path="/lop-hoc" element={<ClassPage />} />
                <Route path="/thoi-khoa-bieu" element={<SchedulePage />} />
                <Route path="/diem" element={<GradePage />} />
                <Route path="/diem-danh" element={<AttendancePage />} />

            </Route>

            {/* Route dành cho sinh viên */}
            <Route path="/sinh-vien" element={<StudentLayout />}>
                {
                    StudentRoute.map((route, index) => (
                        <Route key={index} path={route.path} element={isAuthencation && role === null ? route.element : <Navigate to="/dang-nhap" replace />}></Route>
                    ))
                }
            </Route>

            {/* Route dành cho giảng viên */}
            <Route path={slugTeacher !== null ? `/${slugTeacher}` : '/giang-vien'} element={<TeacherLayout />} >
                {
                    TeacherRoute.map((route, index) => (
                        <Route key={index} path={route.path} element={isAuthencation && role !== null ? route.element : <Navigate to="/dang-nhap" replace />} />
                    ))
                }
            </Route>

            {/* Route cho notfoud 404 */}
            <Route path="*" element={<NotFoundPage />} />

        </Routes>
    );
};
export default AppRoutes