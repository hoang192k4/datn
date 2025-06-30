import axiosTeacherInstance from "../config/axiosTeacher"

export const getClassrooms = async (key: string | null, page: number | null) => {
    const response = await axiosTeacherInstance.get('/classrooms', {
        params: {
            key,
            page
        }
    });
    return response.data;
}