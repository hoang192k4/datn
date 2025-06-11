import axiosTeacherInstance from "../config/axiosTeacher";

export const teacherLogin = async (email: string, password: string) => {
    const response = await axiosTeacherInstance.post('/teachers/login', {
        requiresAuth: false,
        email,
        password,
    });

    return response;
}


export const teacherAuth = async () => {
    const response = await axiosTeacherInstance.get('/teachers/me');
    return response;
}

export const teacherLogout = async () => {
    const response = await axiosTeacherInstance.post('/teachers/logout');
    return response;
}
