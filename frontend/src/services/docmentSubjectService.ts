import axiosTeacherInstance from "../config/axiosTeacher"
import type { ChapterInstance, Lecture } from "../types/documentSubject";


export const getSubjetsByTeacher = async () => {
    return await axiosTeacherInstance.get('/subjects');
}


export const getDetailDocumentBySubjectId = async (subjectId: number) => {
    const response = await axiosTeacherInstance.get('/subjects/detail-subject', {
        params: {
            subject_id: subjectId
        }
    });
    return response.data;
}


export const getListSubjectKeyword = async () => {
    const response = await axiosTeacherInstance.get('/subjects/search-subject');
    return response.data;
}

export const createChapter = async (subjectId: number, title: string, position: number) => {
    return await axiosTeacherInstance.post('/chapters', {
        subject_id: subjectId,
        title,
        position
    })
}


export const deleteChapter = async (chapterId:number) => {
    return await axiosTeacherInstance.delete(`/chapters/${chapterId}`);
}


export const updateChapter = async (subjectId:number, chapterId:number, data: Partial<ChapterInstance>) => {
    return await axiosTeacherInstance.put(`/chapters/${chapterId}`,{
        ...data,
        subject_id: subjectId
    })
}


export const createLecture = async (data: Lecture) => {
    return await axiosTeacherInstance.post('/lectures', data);
}


export const deleteLecture = async (id: number) => {
    return await axiosTeacherInstance.delete(`/lectures/${id}`);
}


export const updateLecture = async (id: number, chapterId: number, data: Partial<Lecture>) => {
    return await axiosTeacherInstance.put(`/lectures/${id}`, {
        ...data,
        chapter_id: chapterId
    });
}

