import axiosTeacherInstance from "../config/axiosTeacher"


export const getCourseSectionByTeacher = (key: any) => {
    return axiosTeacherInstance.get('/course-sections', {
        key
    });
}