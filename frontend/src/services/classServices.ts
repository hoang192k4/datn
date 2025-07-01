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

//call api lấy chi tiết tổng kết điêm theo sinh viên 
export const getSummaryGradesByStudent = async (studentId: number) => {
    const response = await axiosTeacherInstance.get(`/summary-grades/${studentId}`);
    return response.data;
}