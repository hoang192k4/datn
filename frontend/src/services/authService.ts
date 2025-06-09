import axiosTeacherTnstance from "../config/axiosTeacher";

export const teacherLogin = async (email: string, password: string) => {
    const response = await axiosTeacherTnstance.post('/teachers/login', {
        requiresAuth: false,
        email,
        password,
    });

    return response;
}
