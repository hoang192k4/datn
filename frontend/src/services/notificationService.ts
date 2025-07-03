import axiosStudentInstance from "../config/axiosStudent";
import axiosTeacherInstance from "../config/axiosTeacher"
import type { NotificationType } from "../enums/NotificationType";
import type { Paginate } from "../types/paginate";


interface NotificationCourseSection {
    title: string,
    body: string,
    course_section_id?: number;
    public_type?: "public" | "private" | string;
}

interface NotificationStudent {
    title: string,
    body: string,
    receiver_ids: string[],
}


interface FormValues {
    title: string;
    content: string;
    course_section_id?: OptionType;
    public?: string;
    push_notification: string;
}


interface StudentFormValues {
    title: string;
    content: string;
    push_notification: string;
}

type OptionType = { value: string | number; label: string };
export const getMyNotifications = ({ page, limit, key }: Paginate, status: '' | 'public' | 'private' | string) => {
    return axiosTeacherInstance.get('/me/posts', {
        params: {
            limit,
            page,
            key,
            status
        }
    });
}


export const getMyStudents = (key: any, page: number | null = null) => {
    return axiosTeacherInstance.get('/me/students', {
        params: {
            key,
            page
        }
    })
}

export const sendNotificationToCourseSection = ({ title, body, course_section_id, public_type }: NotificationCourseSection) => {
    return axiosTeacherInstance.post('/notifications/send-to-course-section', {
        title,
        body,
        course_section_id,
        public_type
    });
}

export const sendNotificationToStudent = ({ title, body, receiver_ids }: NotificationStudent) => {
    return axiosTeacherInstance.post('/notifications', {
        title,
        body,
        receiver_ids
    });
}

export const getStudentNotifications = ({ page, limit, key }: Paginate, status: string) => {
    return axiosTeacherInstance.get('/me/students/notifications', {
        params: {
            page,
            limit,
            key,
            status
        }
    })
}

export const deletePost = async (id: number) => {
    const response = await axiosTeacherInstance.delete(`/posts/${id}`);
    return response.data;
}

export const deleteNotification = async (id: number) => {
    const response = await axiosTeacherInstance.delete(`/notifications/${id}`);
    return response.data;
}

export const updatePost = async (data: FormValues, id: number) => {
    const response = await axiosTeacherInstance.put(`posts/${id}`, {
        ...data,
        course_section_id: data.course_section_id?.value,
    });
    return response.data;
}

export const updateStudentNotification = async (data: StudentFormValues, id: number) => {
    const response = await axiosTeacherInstance.put(`/notifications/${id}`,
        {
            ...data
        }
    );
    return response.data;
}

export const getNotifications = async ({ limit, page, key }: Paginate, type: NotificationType | null) => {
    const response = await axiosTeacherInstance.get('/notifications', {
        params: {
            limit, page, key, type
        }
    });
    return response.data;
}

export const sendFeedback = async (title: string, body: string, receiver_ids: any[]) => {
    const response = await axiosStudentInstance.post('/feedbacks', {
        title,
        body,
        receiver_ids
    });

    return response.data;
}


export const getFeedbackSendFromStudent = async (key: string | null = null, page: number | null = null) => {
    const response = await axiosStudentInstance.get('/feedbacks', {
        params: {
            key,
            page,
        }
    })
    return response.data;
}