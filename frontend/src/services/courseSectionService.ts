import axiosTeacherInstance from "../config/axiosTeacher"


export const getCourseSectionByTeacher = (key: any, page: number | null = null) => {
    return axiosTeacherInstance.get('/course-sections', {
        params: {
            key,
            page
        }
    });
}