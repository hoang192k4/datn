import axiosTeacherInstance from "../config/axiosTeacher"

export const getSchedules = async (key: string | null, session: string | null, dayOfWeek: number | null, page: number | null, semester: number | null) => {
    const response = await axiosTeacherInstance.get('/schedules', {
        params: {
            key,
            session,
            day_of_week: dayOfWeek,
            page,
            semester
        }
    });
    return response.data;
}