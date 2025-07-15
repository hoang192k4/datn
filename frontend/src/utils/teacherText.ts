import { StatusActiveInactive } from "../enums/StatusActiveInactive";

export const teacherStatusMap = {
    [StatusActiveInactive.Active]: 'Hoạt Động',
    [StatusActiveInactive.Inactive]: 'Tạm Ngưng'
}


export const teacherRoleMap = {
    department_admin: 'Trưởng Bộ Môn',
    subject_teacher: 'GV Bộ Môn',
    homeroom_teacher: 'GV Chủ Nhiệm',
    faculty_admin:'Trưởng Khoa'
}