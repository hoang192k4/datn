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
import StudentManagement from "../pages/admin/student/StudentManagement";

export const TeacherRoute = [
    {
        'path': 'dashboard',
        'element': <Dashboard />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': '',
        'element': <Dashboard />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'lop-hoc',
        'element': <Class />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'thong-tin-ca-nhan',
        'element': <TeacherProfile />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'doi-mat-khau',
        'element': <ChangePasswrod />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'tai-lieu',
        'element': <DocumentManager />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'tai-lieu/tai-lieu-chi-tiet/:id',
        'element': <SubjectDetail />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'diem-danh',
        'element': <AttendancePage />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },

    {
        'path': 'thong-bao/danh-sach',
        'element': <Notification />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'thong-bao/khoa-va-sinh-vien',
        'element': <FacultyStudentNotification />,
        roles: ["subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'diem',
        'element': <Grade />,
        roles: ["faculty_admin", "department_admin", "subject_teacher", "homeroom_teacher"],
    },
    {
        'path': 'sinh-vien',
        'element': <StudentManagement />,
        roles: ["faculty_admin"],
    },
];
