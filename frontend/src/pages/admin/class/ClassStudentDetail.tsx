import Swal from "sweetalert2";
import { attachStudentByCourseSection } from "../../../services/courseSectionService";
import type { StudentList } from "../../../types/student";
import { formatDayMonthYear, getInitials } from "../../../utils/stringUtil";
import { statusMap } from "../../../utils/studentText";
import { genderMap } from "../../../utils/genderMap";
import { useEffect, useState } from "react";
import type { SummaryGradeByStudent } from "../../../types/summaryGrade";
import { Evaluation } from "../../../enums/Evaluation";
import { Loading } from "../../../components/ui/Loading";
import { getSummaryGradesByStudent } from "../../../services/classServices";
import { HttpStatus } from "../../../enums/HttpStatus";

interface PropClass {
    student?: StudentList,
    currentClassId: number | null,
    showBtnAddStudent: boolean,
    fetchStudentList?: (courseSectionId: number) => void,
    setShowPopupAddStudent?: React.Dispatch<React.SetStateAction<'show' | 'hide'>>,
    setShowPopup?: React.Dispatch<React.SetStateAction<'show' | 'hide'>>,
}
const ClassStudentDetail = ({ student, setShowPopup, showBtnAddStudent,
    setShowPopupAddStudent, currentClassId,
    fetchStudentList }: PropClass) => {

    const [summaryGradeByStudent, setSummaryGradeByStudent] = useState<SummaryGradeByStudent[]>([]);
    const [loading, setLoading] = useState(false);
    const handleClose = () => {
        if (showBtnAddStudent && setShowPopupAddStudent) {
            setShowPopupAddStudent('hide');
        } else if (!showBtnAddStudent && setShowPopup) {
            setShowPopup('hide');
        } else {
            console.warn('Không có phương thức set popup nào được truyền vào');
        }
    }

    const fetchSummaryGradeByStudent = async (studentId: number) => {
        try {
            setLoading(true);
            const res = await getSummaryGradesByStudent(studentId);
            if (res.status === HttpStatus.SUCCESS) {
                setSummaryGradeByStudent(res.data);
            }
        } catch (errors) {
            console.log(errors);
        } finally { setLoading(false); }
    }

    useEffect(() => {
        if (student)
            fetchSummaryGradeByStudent(student.id);
    }, [student])

    const handleAddStudentByCourseSection = async (studentId: number | undefined) => {
        Swal.fire({
            title: "Bạn đồng ý thêm sinh viên này vào lớp?",
            showCancelButton: true,
            icon: "question",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (currentClassId && studentId) {
                    const res = await attachStudentByCourseSection(studentId, currentClassId);
                    if (showBtnAddStudent && setShowPopupAddStudent) {
                        setShowPopupAddStudent('hide');
                    }
                    if (fetchStudentList) {
                        await fetchStudentList(currentClassId);
                        Swal.fire({
                            title: res.message,
                            icon: "success",
                            draggable: true
                        })
                    }
                }
            }
        }).catch((errors) => {
            if (errors)
                console.log(errors);
            Swal.fire({
                title: "Hệ thống đang có vấn đề. Vui lòng thử lại!",
                icon: "error",
                draggable: true
            });
        })
    }

    return (
        <>

            <div className="course-section-popup-overlay" id="popup" onClick={handleClose}>
                <div className="course-section-popup-content-container" onClick={(e) => e.stopPropagation()} >
                    <div className="course-section-popup-content" >
                        <span className="course-section-popup-close-btn" onClick={handleClose}>&times;</span>

                        <div className="course-section-popup-left">
                            <div className="course-section-popup-avatar">{student?.name && getInitials(student?.name)}</div>
                            <div className="course-section-popup-student-name">{student?.name}</div>
                            <div className="course-section-popup-student-id">MSSV: {student?.student_code}</div>
                        </div>

                        <div className="course-section-popup-right">
                            <div className="course-section-popup-info-title">Thông tin chi tiết</div>
                            <div className="course-section-popup-info-grid">
                                <div className="course-section-popup-info-item">
                                    <div className="label">Giới tính</div>
                                    <div className="value">{student?.gender && genderMap[student?.gender]}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Ngày sinh</div>
                                    <div className="value">{student?.date_of_birth && formatDayMonthYear(student?.date_of_birth)}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Ngành học</div>
                                    <div className="value">{student?.major}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Lớp học</div>
                                    <div className="value">{student?.class}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Giáo viên chủ nhiệm</div>
                                    <div className="value">{student?.homeroom_teacher}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Email</div>
                                    <div className="value">{student?.email}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Địa chỉ</div>
                                    <div className="value">{student?.address}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Ngày nhập học</div>
                                    <div className="value">{student?.enrollment_date && formatDayMonthYear(student?.enrollment_date)}</div>
                                </div>
                                <div className="course-section-popup-info-item">
                                    <div className="label">Tình trạng</div>
                                    <div className="value">{student?.status && statusMap[student?.status]}</div>
                                </div>
                                {showBtnAddStudent &&
                                    <div className="course-section-popup-info-item">
                                        <button className="btn-attendance" onClick={() => handleAddStudentByCourseSection(student?.id)}>Thêm sinh viên</button>
                                    </div>
                                }
                            </div>
                        </div>


                    </div>

                    <div className="course-section-summary">
                        {loading ? <Loading /> :

                            summaryGradeByStudent.length > 0 ?
                                <>
                                    {summaryGradeByStudent.map((semester: any, item) => (
                                        <div key={item}>
                                            <h3 style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #1e3a8a' }}>{semester.name} ( {semester.start_year} - {semester.end_year} )</h3>
                                            <table className="course-section-summary-table">
                                                <thead>
                                                    <tr>
                                                        <th>STT</th>
                                                        <th>Lớp Học</th>
                                                        <th>Môn Học</th>
                                                        <th>CC</th>
                                                        <th>TB Kiểm Tra</th>
                                                        <th>Thi Lần 1</th>
                                                        <th>Thi Lần 2</th>
                                                        <th>Tổng Kết</th>
                                                        <th>Xếp Loại</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {semester.summaries.map((smrStudent: any, index: number) => (
                                                        <tr key={smrStudent.id} className={(smrStudent.evaluation === 'poor' ||
                                                            smrStudent.evaluation === 'very_poor') ? 'poor-evaluation' : ''}>
                                                            <td>{index + 1}</td>
                                                            <td>{smrStudent.course_section_name}</td>
                                                            <td>{smrStudent.subject_name}</td>
                                                            <td>{smrStudent.attendance_score ?? '--'}</td>
                                                            <td>{smrStudent.avg_score}</td>
                                                            <td>{smrStudent.exam1_score ?? '--'}</td>
                                                            <td>{smrStudent.exam2_score ?? '--'}</td>
                                                            <td>{smrStudent.final_score}</td>
                                                            <td>{Evaluation[smrStudent.evaluation as keyof typeof Evaluation]}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ))}
                                </>
                                : <p style={{ textAlign: 'center', color: '#ccc' }}>Điểm tổng kết chưa được cập nhật</p>
                        }

                    </div>
                </div>
            </div >
        </>
    )
}

export default ClassStudentDetail