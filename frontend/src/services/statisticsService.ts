import axiosTeacherInstance from "../config/axiosTeacher"

export const getStatisticsForAdmin = async () => {
    const response = await axiosTeacherInstance.get('/statistics/admin');
    return response.data;
}