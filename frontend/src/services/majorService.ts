import axiosTeacherInstance from "../config/axiosTeacher"

export const getMajors = async () => {
    const response = await axiosTeacherInstance.get('/majors');
    return response.data;
}