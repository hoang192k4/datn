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

export const deleteGradeColumn = (courseSectionId: number | null, gradeTypeId: number, attempt: number, type: string) => {
    return axiosTeacherInstance.delete('/grades', {
        data: {
            course_section_id: courseSectionId,
            grade_type_id: gradeTypeId,
            attempt: attempt,
            type: type
        }

    })
}

export const exportExcel = async (courseSectionId: number) => {
    return await axiosTeacherInstance.get('/grades/export', {
        params: {
            course_section_id: courseSectionId
        },
        responseType: 'blob'
    });
}

export const importGradeExcel = async (formData: FormData) => {
    const response = await axiosTeacherInstance.post('/grades/import',
        formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }
    );
    return response.data;
}


export const exportGradeTemplate = async (courseSectionId: number, selected: string[]) => {
    return await axiosTeacherInstance.post('/grades/export-template', {
        course_section_id: courseSectionId,
        selected_columns: selected
    }, {
        responseType: 'blob'
    });
}