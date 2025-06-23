import type { StudentList } from "../../../types/student";
import { formatDayMonthYear, getInitials } from "../../../utils/stringUtil";
import { genderText, statusMap } from "../../../utils/studentText";

interface PropClass {
    student: StudentList,
    setShowPopup: React.Dispatch<React.SetStateAction<'show' | 'hide'>>;
}
const ClassStudentDetail = (props: PropClass) => {
    return (
        <>
            <div className="course-section-popup-overlay" id="popup" onClick={() => props.setShowPopup('hide')}>
                <div className="course-section-popup-content" onClick={(e) => e.stopPropagation()}  >
                    <span className="course-section-popup-close-btn" onClick={() => props.setShowPopup('hide')}>&times;</span>

                    <div className="course-section-popup-left">
                        <div className="course-section-popup-avatar">{getInitials(props.student.name)}</div>
                        <div className="course-section-popup-student-name">{props.student.name}</div>
                        <div className="course-section-popup-student-id">MSSV: {props.student.student_code}</div>
                    </div>

                    <div className="course-section-popup-right">
                        <div className="course-section-popup-info-title">Thông tin chi tiết</div>
                        <div className="course-section-popup-info-grid">
                            <div className="course-section-popup-info-item">
                                <div className="label">Giới tính</div>
                                <div className="value">{genderText[props.student.gender]}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Ngày sinh</div>
                                <div className="value">{formatDayMonthYear(props.student.date_of_birth)}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Ngành học</div>
                                <div className="value">{props.student.major}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Lớp học</div>
                                <div className="value">{props.student.class}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Giáo viên chủ nhiệm</div>
                                <div className="value">{props.student.homeroom_teacher}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Email</div>
                                <div className="value">{props.student.email}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Địa chỉ</div>
                                <div className="value">{props.student.address}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Ngày nhập học</div>
                                <div className="value">{formatDayMonthYear(props.student.enrollment_date)}</div>
                            </div>
                            <div className="course-section-popup-info-item">
                                <div className="label">Tình trạng</div>
                                <div className="value">{statusMap[props.student.status]}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ClassStudentDetail