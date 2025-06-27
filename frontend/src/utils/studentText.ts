import { Gender } from "../enums/Gender"
import { StudentStatus } from "../enums/StudentStatus"

export const genderText = {
    [Gender.Male]: 'Nam',
    [Gender.Female]: 'Nữ'
}
export const statusMap = {
    [StudentStatus.Active]: 'Đang học',
    [StudentStatus.Graduated]: 'Đã tốt nghiệp',
    [StudentStatus.Suspended]: 'Bị đình chỉ',
    [StudentStatus.Pending]: 'Chờ xét duyệt',
    [StudentStatus.Dropped_Out]: 'Đã thôi học',
    [StudentStatus.Deferment]: 'Bảo lưu'
}