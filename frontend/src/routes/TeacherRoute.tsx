import Class from "../pages/admin/class/Class";
import Dashboard from "../pages/admin/dashboard/dashboard"
import ChangePasswrod from "../pages/admin/profile/ChangePassword";
import TeacherProfile from "../pages/admin/profile/TeacherProfile";
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
        'path': 'thong-tin-ca-nhan',
        'element': <TeacherProfile />,
    },
     {
        'path': 'doi-mat-khau',
        'element': <ChangePasswrod />,
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
