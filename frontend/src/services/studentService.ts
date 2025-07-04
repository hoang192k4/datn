import axiosStudentInstance from "../config/axiosStudent";
import axiosTeacherInstance from "../config/axiosTeacher"
import type { StudentForm } from "../types/student";


export const getAllStudents = async (key: string, page: number | null = null, status: string | null) => {
    const response = await axiosTeacherInstance.get('/students', {
        params: {
            key,
            page,
            status
        }
    });
    return response.data;
}

export const exportStudentsExcel = async (status: string | null) => {
    return await axiosTeacherInstance.get('/students/export', {
        params: {
            status
        },
        responseType: 'blob'
    });
}


export const updateStudent = async (data: StudentForm) => {
    const response = await axiosTeacherInstance.put(`students/${data.id}`, data);
    return response.data;
}

export const createStudent = async (data: StudentForm) => {
    const response = await axiosTeacherInstance.post(`students`, data);
    return response.data;
}

export const importExelStudent = async (formData: FormData) => {
    const response = await axiosTeacherInstance.post('/students/import',
        formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
    return response.data;
}

export const getSummaryGradesMyStudent = async () => {
    const response = await axiosStudentInstance.get('/me/student-summary-grades');
    return response.data;
}

export const getConductScoresMyStudent = async () => {
    const response = await axiosStudentInstance.get('/me/conduct-scores');
    return response.data;
}