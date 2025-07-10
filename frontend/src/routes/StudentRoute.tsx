
import ConductScore from "../pages/student/conduct-score/ConductScore";
import StudentNotification from "../pages/student/notification/StudentNotification";;
import StudentProfile from "../pages/student/profile/StudentProfile";
import StudentSchedule from "../pages/student/schedule/StudentSchedule";
import SummaryGrade from "../pages/student/summary-grade/SummaryGrade";


export const StudentRoute = [
  {
    'path': '',
    'element': <SummaryGrade />,
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
  {
    'path': 'diem-tong-ket',
    'element': <SummaryGrade />
  },
  {
    'path': 'diem-ren-luyen',
    'element': <ConductScore />
  },
]