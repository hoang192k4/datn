

export interface SummaryGradeByStudent {
    id: number,
    semester_id: number,
    semester_name: string,
    subject_id: number,
    subject_name: string,
    attempt: number,
    start_year: string,
    end_year: string,
    attendance_score: number | null,
    avg_score: number,
    exam1_score: number | null,
    exam2_score: number | null,
    final_score: number,
    evaluation: any,
    course_section_id: number,
    course_section_name: string,
    created_at: number,
    note: string | null
}