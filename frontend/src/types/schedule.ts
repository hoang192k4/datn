import type { CourseSectionSchedule } from "./courseSecion"

export interface Schedule {
    id: number,
    period_start: number,
    period_end: number,
    period_number: number,
    session: 'morning' | 'afternoon',
    classroom: {
        id: number,
        name: string,
    }
    day_of_week: number,
    course_section: CourseSectionSchedule,
    start_time: string,
    end_time: string,
}