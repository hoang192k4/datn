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

export const detachStudentByCourseSection = async (studentId:number,courseSectionId: number) => {
    const response = await axiosTeacherInstance.delete('/course-sections/detach-student',{
        params:{
            student_id: studentId,
            course_section_id: courseSectionId
        }
    });
    return response.data;
}