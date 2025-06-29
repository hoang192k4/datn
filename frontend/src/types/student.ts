import type { Gender } from "../enums/Gender"
import { StudentStatus } from "../enums/StudentStatus"

export interface StudentForm {
    id: number;
    name: string,
    student_code: string,
    email: string,
    date_of_birth: string,
    address: string,
    gender: Gender,
    major: string,
    status: StudentStatus,
    major_id: number,
}


export interface StudentList {
    id: number,
    name: string,
    student_code: string,
    email: string,
    date_of_birth: string,
    address: string,
    class: string,
    homeroom_teacher: string,
    gender: Gender,
    enrollment_date: string,
    graduation_date: string | null,
    major: string,
    major_id: number,
    status: StudentStatus
}