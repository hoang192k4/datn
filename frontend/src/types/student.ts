import type { Gender } from "../enums/Gender"
import { StudentStatus } from "../enums/StudentStatus"

export interface StudentForm {
    name: string,
    student_code: string,
    email: string,
    date_of_birth: string,
    address: string,
    gender: Gender,
    major: string,
    status: StudentStatus
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
    status: StudentStatus
}