import axiosTeacherInstance from "../config/axiosTeacher"
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

export const getMyNotifications = ({ page, limit }: Paginate) => {
    return axiosTeacherInstance.get('/me/posts', {
        params: {
            limit,
            page
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