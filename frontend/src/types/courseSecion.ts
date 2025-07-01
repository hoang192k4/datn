import type { CourseSectionStatus } from "../enums/CourseSectionStatus"
import type { SemesterList } from "./semester";


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

export interface CourseSectionSchedule {
    id: number;
    name: string;
    start_date: string; // ISO format date string, e.g. "2025-06-01"
    end_date: string;   // ISO format date string
    week_total: number;
    subject: string;
    semester: SemesterList;
    status: string; // tùy enum thực tế bạn có thể thu hẹp hơn
    teacher: string;
    created_at: string;
}