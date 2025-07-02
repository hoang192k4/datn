import DashboardStudent from "../pages/student/dashboard/DashboardSrudent";
import StudentNotification from "../pages/student/notification/StudentNotification";;
import StudentProfile from "../pages/student/profile/StudentProfile";
import StudentSchedule from "../pages/student/schedule/StudentSchedule";


export const StudentRoute = [
  {
    'path': 'dashboard',
    'element': <DashboardStudent />,
  },
  {
    'path': '',
    'element': <DashboardStudent />,
  },
  {
    'path': 'thong-tin-ca-nhan',
    'element': <StudentProfile />,
  },
  {
    'path': 'thoi-khoa-bieu',
    'element': <StudentSchedule />,
  },
  {
    'path': 'thong-bao',
    'element': <StudentNotification />,
  },
]