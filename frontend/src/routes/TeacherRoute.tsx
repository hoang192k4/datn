import Class from "../pages/admin/class/Class";
import Dashboard from "../pages/admin/dashboard/dashboard"
import DocumentManager from "../pages/admin/document/DocumentManager";
import SubjectDetail from "../pages/admin/document/SubjectDetail";
import ChangePasswrod from "../pages/admin/profile/ChangePassword";
import TeacherProfile from "../pages/admin/profile/TeacherProfile";
import AttendancePage from "../pages/admin/attendance/AttendancePage";
import Grade from "../pages/admin/grade/GradeManagement";
import Notification from "../pages/admin/notification/Notification";
import FacultyStudentNotification from "../pages/admin/notification/faculty_student/FacultyStudentNotification";

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
        'path': 'tai-lieu',
        'element': <DocumentManager />,
    },
    {
        'path': 'tai-lieu/tai-lieu-chi-tiet/:id',
        'element': <SubjectDetail />,
    },
    {
        'path': 'diem-danh',
        'element': <AttendancePage />
    },

    {
        'path': 'thong-bao/danh-sach',
        'element': <Notification />
    },
    {
        'path': 'thong-bao/khoa-va-sinh-vien',
        'element': <FacultyStudentNotification />
    },
    {
        'path': 'diem',
        'element': <Grade />
    },
];
