import axiosTeacherInstance from "../config/axiosTeacher";
import type { TeacherForm } from "../types/teacher";

export const teacherLogin = async (email: string, password: string) => {
    const response = await axiosTeacherInstance.post('/teachers/login', {
        requiresAuth: false,
        email,
        password,
    });

    return response;
}


export const teacherLogout = async () => {
    const response = await axiosTeacherInstance.post('/teachers/logout');
    return response;
}

export const authCheck = async () => {
    const response = await axiosTeacherInstance.get('/auth/me');
    return response;
}

export const teacherChangePassword = async (current_password: string, new_password: string, new_password_confirmation: string) => {
     const response = await axiosTeacherInstance.post('/teachers/change-password', {
        current_password,
        new_password,
        new_password_confirmation
    });

    return response;
}

export const teacherUpdate = async (data: TeacherForm) => {
    const response = await axiosTeacherInstance.post('/teachers/update-profile',data);
    return response;
}