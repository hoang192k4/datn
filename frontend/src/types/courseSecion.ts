import type { CourseSectionStatus } from "../enums/CourseSectionStatus"


export interface CourseSection {
    class: string,
    classroom: string,
    created_at: string,
    end_start: string | null
    id: number,
    name: string,
    semester: string,
    start_date: string,
    status: CourseSectionStatus,
    students_total: number,
    subject: string,
    week_total: number
}

