import axiosTeacherInstance from "../config/axiosTeacher"

export const getStatisticsForAdmin = async (role: string) => {
    const response = await axiosTeacherInstance.get('/statistics', {
        params: {
            role,
        }
    });
    return response.data;
}