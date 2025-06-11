import axiosStudentInstance from "../config/axiosStudent"


export const studentLogin = async(email:string, password:string) => {
    const response = await axiosStudentInstance.post('/students/login',{
        requiresAuth:false,
        email,
        password
    });
    
    return response;
}

export const studentLogout = async() => {
    const response = await axiosStudentInstance.post('/students/logout');
    return response;
}