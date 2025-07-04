import { useSelector } from "react-redux";
import { formatDayMonthYear, getInitials } from "../../utils/utils";
import { genderMap } from "../../utils/genderMap";
import type { Gender } from "../../enums/Gender";
import type { StudentStatus } from "../../enums/StudentStatus";
import { statusMap } from "../../utils/studentText";


const ProfileStudent = () => {
    const user = useSelector((state: any) => state.auth.user);
    return (
        <>
            <div className="student-info-card-container">
                <div className="student-info-avatar">
                    {getInitials(user.name)}
                </div>
                <div className="student-info-content">
                    <h2 className="student-info-name">🎓 {user.name}</h2>
                    <div className="student-info-button">🔖 <b>Mã SV:</b> {user.student_code}</div>
                    <div className="student-info-button">🏫 <b>Lớp:</b> {user.class}</div>
                    <div className="student-info-button">🖥️ <b>Khoa:</b> {user.major}</div>
                    <div className="student-info-button">⚥ <b>Giới tính:</b> {genderMap[user.gender as Gender]}</div>
                    <div className="student-info-button">🎂 <b>Ngày sinh:</b> {formatDayMonthYear(user.date_of_birth)}</div>
                    <div className="student-info-button">📌 <b>Tình trạng:</b> {statusMap[user.status as StudentStatus]}</div>
                    <div className="student-info-button">✉️ <b>Email:</b> {user.email}</div>
                </div>
            </div>
        </>
    )
}
export default ProfileStudent