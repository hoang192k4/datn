import axiosTeacherInstance from "../config/axiosTeacher"

export const getListClasses = async (key: string | null = null, page: number | null = null) => {
    const response = await axiosTeacherInstance.get('/classes', {
        params: {
            key,
            page
        }
    });
    return response.data;
}