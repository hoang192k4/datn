import type { AttendanceStatus } from "../enums/AttendanceStatus";
import type { StudentStatus } from "../enums/StudentStatus";


export interface AttendanceForm {
    session_id:number,
    attendances: {
        student_id: number;
        status: AttendanceStatus;
        note?: string;
    }[];
}
export interface StudentAttendace {
    id: number,
    name: string,
    student_code: string,
    email: string,
    date_of_birth: string,
    address: string,
    gender: string,
    enrollment_date: string,
    graduation_date: string,
    major: string,
    status: StudentStatus
}
