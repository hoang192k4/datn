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

export interface CourseSectionSchedule {
    id: number;
    name: string;
    start_date: string; // ISO format date string, e.g. "2025-06-01"
    end_date: string;   // ISO format date string
    week_total: number;
    subject: string;
    semester: string;
    status: string; // tùy enum thực tế bạn có thể thu hẹp hơn
    teacher: string;
    created_at: string;
}