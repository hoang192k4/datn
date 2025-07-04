import type { CourseSection } from "./courseSecion";

export interface Post{
    id: number,
    title: string,
    content: string,
    course_section: CourseSection,
    teacher: string, 
    created_at: string,
    status: string
}