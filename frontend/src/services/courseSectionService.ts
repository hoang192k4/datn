import axiosTeacherInstance from "../config/axiosTeacher"


export const getCourseSectionByTeacher = (key: any, page: number | null = null) => {
    return axiosTeacherInstance.get('/course-sections', {
        params: {
            key,
            page
        }
    });
}

export const getListStudentByCourseSection = async (courseSectionId: number) => {
    const response = await axiosTeacherInstance.get(`/course-sections/${courseSectionId}/students`);
    return response.data;
}