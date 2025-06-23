import axiosTeacherInstance from "../config/axiosTeacher"


export const getAllStudents = async (key: string, page: number | null = null) => {
    const response = await axiosTeacherInstance.get('/students', {
        params: {
            key,
            page
        }
    });
    return response.data;
}