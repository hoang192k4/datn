import DashboardStudent from "../pages/student/dashboard/DashboardSrudent";
import StudentProfile from "../pages/student/profile/StudentProfile";


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
]