import axiosTeacherInstance from "../config/axiosTeacher"
import type { CourseSectionStatus } from "../enums/CourseSectionStatus";
import type { ClassForm } from "../types/classes";

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

export const getListClassesFilter = async (key: string | null = null, page: number | null = null, status: CourseSectionStatus | null | null) => {
    const response = await axiosTeacherInstance.get('/classes/getAllFilter', {
        params: {
            key,
            page,
            status
        }
    });
    return response.data;
}

export const createClass = async (formData: ClassForm) => {
    const response = await axiosTeacherInstance.post('/classes', formData);
    return response.data;
}

export const updateClass = async (formData: ClassForm, classId: number) => {
    const response = await axiosTeacherInstance.put(`/classes/${classId}`, formData);
    return response.data;
}

export const updateStatusClass = async (status: CourseSectionStatus, classId: number) => {
    const response = await axiosTeacherInstance.patch(`/classes/${classId}`, { status });
    return response.data;
}