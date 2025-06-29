import axiosTeacherInstance from "../config/axiosTeacher"
type ScheduleFormData = {
    course_section: { value: number | null, label: string | null };
    day_of_week: string;
    period_start: number | null;
    period_number: number | null;
    classroom: { value: number | null, label: string | null };
};


export const getSchedules = async (key: string | null, session: string | null, dayOfWeek: number | null, page: number | null, semester: number | null, classroomId: number | null) => {
    const response = await axiosTeacherInstance.get('/schedules', {
        params: {
            key,
            session,
            day_of_week: dayOfWeek,
            page,
            semester,
            classroom_id: classroomId
        }
    });
    return response.data;
}

export const createSchedule = async (data: ScheduleFormData) => {
    const response = await axiosTeacherInstance.post('/schedules', {
        ...data,
        course_section_id: data.course_section.value,
        classroom_id: data.classroom.value,
    });

    return response.data;
}