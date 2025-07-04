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

type GradeType = {
    id: number;
    name: string;
    weight: number;
};

type Grade = {
    id: number;
    score: string;
    score_visibility: string;
    attempt: number;
    grade_type: GradeType;
};

type SummaryGrade = {
    attendance_score: number | null;
    exam1_score: string | null;
    exam2_score: string | null;
    avg_score: string;
    final_score: string;
    evaluation: string;
    note:string
};

export type StudentGrade = {
    student_code: string;
    name: string;
    grades: Grade[][];
    summary_grade: SummaryGrade;
};
 