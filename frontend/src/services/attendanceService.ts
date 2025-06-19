import axiosTeacherInstance from "../config/axiosTeacher"
import type { AttendanceForm } from "../types/attendance";

export const getListAttendanceStudent = async (courseSectionId: number) => {
    const response = await axiosTeacherInstance.get(`/course-section-attendances/${courseSectionId}/attendances`);
    return response.data;
}


export const getListStudentByCourseSection = async (courseSectionId: number) => {
    const response = await axiosTeacherInstance.get(`/course-section-attendances/${courseSectionId}/students`);
    return response.data;
}

export const createUpdateAttendances = async (sessionId: number, attendance: AttendanceForm) => {
    const response = await axiosTeacherInstance.post('/course-section-attendances',
        { attendance },
        {
            params: {
                session_id: sessionId
            },
        }
    );
    return response.data;
}

export const getListSessionsByCourseSection = async (courseSectionId: number) => {
    const response = await axiosTeacherInstance.get('/course-section-attendances/sessions', {
        params: {
            course_section_id: courseSectionId
        }
    })
    return response.data;
}


export const getListAttendancesBySession = async (sessionId: number) => {
    const response = await axiosTeacherInstance.get('/course-section-attendances/attendances-session', {
        params: {
            session_id: sessionId
        }
    })
    return response.data;
}