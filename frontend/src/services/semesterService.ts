import axiosTeacherInstance from "../config/axiosTeacher"

export const getSemesters = async () => {
    const response = await axiosTeacherInstance.get('/semesters');
    return response.data;
}