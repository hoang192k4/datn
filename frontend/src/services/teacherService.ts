import axiosStudentInstance from "../config/axiosStudent";
import axiosTeacherInstance from "../config/axiosTeacher"
import { StatusActiveInactive } from "../enums/StatusActiveInactive";
import type { TeacherList } from "../types/teacher";

export const getListRole = async () => {
    const response = await axiosTeacherInstance.get('/roles');
    return response.data;
}

export const getListTeacher = async (key: string | null = null, page: number | null = null,
    status: StatusActiveInactive | null = null, role: string | null = null) => {
    const response = await axiosTeacherInstance.get('/teachers', {
        params: {
            key,
            page,
            status,
            role
        }
    });
    return response.data;
}

export const toggleStatusTeacher = async (teacherId: number) => {
    const response = await axiosTeacherInstance.patch(`/teachers/${teacherId}`);
    return response.data;
}

export const updateTeacher = async (teacherId: number, teacherUpdate: Partial<TeacherList>) => {
    const response = await axiosTeacherInstance.put(`/teachers/${teacherId}`, teacherUpdate);
    return response.data;
}

export const createTeacher = async (teacherForm: TeacherList) => {
    const response = await axiosTeacherInstance.post('/teachers', teacherForm);
    return response.data;
}

export const importTeacher = async (formData: FormData) => {
    const response = await axiosTeacherInstance.post('/teachers/import',
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
    return response.data;
}

export const exportTeacher = async (selectedStatus: string | null, selectedRoleId: number | null) => {
    const response = await axiosTeacherInstance.get('/teachers/export', {
        params: {
            'status': selectedStatus,
            'role_id': selectedRoleId
        },
        responseType: 'blob'
    });
    return response.data;
}

export const getTeacherByStudent = async (key: string | null = null, page: number | null = null) => {
    const response = await axiosStudentInstance.get('me/student/teachers', {
        params: {
            key,
            page,
        }
    });
    return response.data;
}