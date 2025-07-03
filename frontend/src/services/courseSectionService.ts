import { api } from "../config/api";
import axiosTeacherInstance from "../config/axiosTeacher"
import type { CourseSectionStatus } from "../enums/CourseSectionStatus";
import type { CourseSection } from "../types/courseSecion";


export const getCourseSectionByTeacher = (key: any, page: number | null = null) => {
    return axiosTeacherInstance.get('/me/course-sections', {
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

export const detachStudentByCourseSection = async (studentId: number, courseSectionId: number) => {
    const response = await axiosTeacherInstance.delete('/course-sections/detach-student', {
        params: {
            student_id: studentId,
            course_section_id: courseSectionId
        }
    });
    return response.data;
}

export const attachStudentByCourseSection = async (studentId: number, courseSectionId: number) => {
    const response = await axiosTeacherInstance.post('/course-sections/attach-student', {
        student_id: studentId,
        course_section_id: courseSectionId
    });
    return response.data;
}

export const createCourseSection = async (formData: CourseSection) => {
    const response = await axiosTeacherInstance.post('/course-sections', formData);
    return response.data;
}

export const updateCourseSection = async (courseSectionId: number, formData: Partial<CourseSection>) => {
    const response = await axiosTeacherInstance.put(`/course-sections/${courseSectionId}`, { ...formData, });
    return response.data;
}

export const updateCourseSectionStatus = async (courseSectionId: number, status: CourseSectionStatus) => {
    const response = await axiosTeacherInstance.patch(`/course-sections/${courseSectionId}`, { status });
    return response.data;
}

export const getCourseSectionFilter = async (keyword: string | null,
    year: string | null,
    page: number | null,
    status: CourseSectionStatus | null,
    semesterId: string | null) => {
    const response = await axiosTeacherInstance.get('/course-sections', {
        params: {
            keyword,
            page,
            status,
            year,
            semester_id: semesterId
        }
    });
    return response.data;
}

export const getCourseSectionByTeacherSlug = async (slug:string, page:number = 1, limit:number =12) => {
    const response = await api.get('/course-sections/slug', {
        params: {
            slug,
            limit,
            page
        }
    })
    return response.data;
}