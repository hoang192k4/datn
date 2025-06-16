import type { LectureStatus } from "../enums/LectureStatus";

export interface Lecture {
    id: number,
    title: string,
    file_path: string,
    chapter_id: number,
    position: number,
    status: LectureStatus,
}

export interface Chapter {
    id: number,
    title: string,
    position: number,
    lectures: Lecture[]
}

export interface DocumentSubject {
    id: number,
    subject_name: string,
    chapters: Chapter[]
}

export interface ChapterInstance {
    id: number,
    title: string,
    position: number,
}