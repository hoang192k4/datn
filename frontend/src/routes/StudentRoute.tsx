import DashboardStudent from "../pages/student/dashboard/DashboardSrudent";
import StudentProfile from "../pages/student/profile/StudentProfile";
import StudentSchedule from "../pages/student/schedule/StudentSchedule";


export const StudentRoute = [
    {
        'path': 'dashboard',
        'element': <DashboardStudent/>,
    },
      {
        'path': '',
        'element': <DashboardStudent/>,
    },
      {
        'path': 'thong-tin-ca-nhan',
        'element': <StudentProfile/>,
    },
    {
        'path': 'thoi-khoa-bieu',
        'element': <StudentSchedule/>,
    },
]