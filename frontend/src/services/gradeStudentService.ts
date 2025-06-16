import axiosStudentInstance from "../config/axiosStudent";
import axiosTeacherInstance from "../config/axiosTeacher"

export const getStudentByCourseSectionId = (courseSectionId: any, key: string = '') => {

    return axiosTeacherInstance.get(`/grades`, {
        params: {
            course_section_id: courseSectionId,
            key
        },
    });
}

export const getGradeTypes = async () => {
    return await axiosTeacherInstance.get('/grade-types');
}

export const updateGradeById = (gradeId: number, score: number) => {
    return axiosTeacherInstance.put(`/grades/${gradeId}`,
        { score }
    );
}

export const addGradeColumnToCourseSection = (courseSectionId: number, gradeTypeId: number) => {
    return axiosTeacherInstance.post('/grades/grade-column',
        {
            course_section_id: courseSectionId,
            grade_type_id: gradeTypeId
        }
    );
}

export const createGrade = (courseSectionId: number, gradeTypeId: number, studentId: number, score: number, attempt: number) => {
    return axiosTeacherInstance.post('/grades', {
        course_section_id: courseSectionId,
        grade_type_id: gradeTypeId,
        student_id: studentId,
        score,
        attempt

    });
}

export const updateSummaryScore = (summaryId: number, scoreType: number, score: number) => {
    return axiosStudentInstance.put(`/summary-grades/${summaryId}`, {
        score_type: scoreType,
        score,
        summary_id: summaryId
    });
}

export const deleteGradeColumn = (courseSectionId: number|null, gradeTypeId: number, attempt: number) => {
    return axiosTeacherInstance.delete('/grades', {
        data: {
            course_section_id: courseSectionId,
            grade_type_id: gradeTypeId,
            attempt: attempt
        }

    })
}