import Class from "../pages/admin/class/Class";
import Dashboard from "../pages/admin/dashboard/dashboard"
import Grade from "../pages/admin/grade/GradeManagement";
import NotificationPage from "../pages/Notification/NotificationPage";

export const TeacherRoute = [
    {
        'path': 'dashboard',
        'element': <Dashboard />,
    },
    {
        'path': '',
        'element': <Dashboard />,
    },
    {
        'path': 'lop-hoc',
        'element': <Class />,
    },
    {
        'path': 'thong-bao',
        'element': <NotificationPage />
    },
    {
        'path': 'diem',
        'element': <Grade />
    },
];
