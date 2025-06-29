import type { CourseSectionStatus } from "../enums/CourseSectionStatus"


export interface CourseSection {
    id: number,
    name: string,
    start_date: string,
    end_date: string,
    class: string,
    class_id?: number,
    teacher: string,
    teacher_id?: number,
    subject: string,
    subject_id?: number,
    semester: string,
    semester_id: number,
    week_total: number,
    status: CourseSectionStatus,
    students_total: number,
    created_at: string,
}

