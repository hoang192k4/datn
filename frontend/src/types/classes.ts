import type { CourseSectionStatus } from "../enums/CourseSectionStatus";

export interface Classes {
    id: number,
    name: string,
    teacher_id: number,
    teacher_name: string,
    start_time: string,
    end_time: string,
    status: CourseSectionStatus,
    studentsId: number[],
}

export interface ClassForm {
    teacher_id: number,
    name: string;
    start_time: string,
    end_time: string,
    teacher_name: string
    studentsId: number[]
}