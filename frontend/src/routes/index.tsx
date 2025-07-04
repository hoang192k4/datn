import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import MainLayout from "../components/layout/MainLayout";
import LoginPage from "../pages/login/LoginPage";
import HomePage from "../pages/home/HomePage";
import TeacherLayout from "../components/layout/TeacherLayout";
import { TeacherRoute } from "./TeacherRoute";
import DocumentPage from "../pages/document/DocumentPage";
import StudentLayout from "../components/layout/StudentLayout";
import { StudentRoute } from "./StudentRoute";
import NotFoundPage from "../pages/notfound/NotFoundPage";
import ForbiddenPage from "../pages/forbidden/ForbiddenPage";
import TeacherPage from "../pages/home/TeacherPage";
import ClassPage from "../pages/class/ClassPage";
const AppRoutes = () => {
    const isAuthencation = useSelector((state: any) => state.auth.isAuthentication);
    const role = useSelector((state: any) => state.auth.user?.role ?? null);

    const slugTeacher = useSelector((state: any) => state.auth.user?.slug ?? null);
    return (
        <Routes>
            {/* Route public */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/dang-nhap" element={isAuthencation && role === null ? <Navigate to="/sinh-vien" replace /> :
                    isAuthencation && role !== null ? <Navigate to={slugTeacher !== null ? `/${slugTeacher}` : '/giang-vien'} replace /> : < LoginPage />} />
                <Route path="/:slug" element={<TeacherPage />} />
                <Route path="/:slug/tai-lieu/:id" element={<DocumentPage />} />
                <Route path="/:slug/lop-hoc/:id" element={<ClassPage />} />

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
                    TeacherRoute.map((route, index) => {
                        let element;
                        if (!isAuthencation) {
                            element = <Navigate to="/dang-nhap" replace />;
                        } else if (route.roles && !route.roles.includes(role)) {
                            element = <Navigate to="/403" replace />;
                        } else {
                            element = route.element;
                        }
                        return <Route key={index} path={route.path} element={element} />
                    })
                }
            </Route>

            <Route path="/403" element={<ForbiddenPage />} />
            {/* Route cho notfoud 404 */}
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/404" element={<NotFoundPage />} />

        </Routes>
    );
};
export default AppRoutes