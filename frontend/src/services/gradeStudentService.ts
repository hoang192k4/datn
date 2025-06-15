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

export const updateGradeById = (gradeId, score) => {
    return axiosTeacherInstance.put(`/grades/${gradeId}`,
        { score }
    );
}

export const addGradeColumnToCourseSection = (courseSectionId, gradeTypeId) => {
    return axiosTeacherInstance.post('/grades/grade-column',
        {
            course_section_id: courseSectionId,
            grade_type_id: gradeTypeId
        }
    );
}

export const createGrade = (courseSectionId: any, gradeTypeId: any, studentId: any, score: any, attempt: any) => {
    return axiosTeacherInstance.post('/grades', {
        course_section_id: courseSectionId,
        grade_type_id: gradeTypeId,
        student_id: studentId,
        score,
        attempt

    });
}

export const updateSummaryScore = (summaryId, scoreType, score) => {
    return axiosStudentInstance.put(`/summary-grades/${summaryId}`, {
        score_type: scoreType,
        score,
        summary_id: summaryId
    });
}