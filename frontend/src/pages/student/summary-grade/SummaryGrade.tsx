import { useEffect, useState } from "react"
import { getSummaryGradesMyStudent } from "../../../services/studentService";
import type { SummaryGradeByStudent } from "../../../types/summaryGrade";
import { HttpStatus } from "../../../enums/HttpStatus";
import { Evaluation } from "../../../enums/Evaluation";
import { Loading } from "../../../components/ui/Loading";
import './SummaryGrade.css';
import ProfileStudent from "../../../components/ui/ProfileStudent";

const SummaryGrade = () => {
    const [summaryGradeStudent, setSummaryGradeStudent] = useState<SummaryGradeByStudent[]>([]);
    const [loadingStudentSummary, setLoadingStudentSumary] = useState(false);


    const fetchSummaryGradesMyStudent = async () => {
        try {
            setLoadingStudentSumary(true);
            const res = await getSummaryGradesMyStudent();
            if (res.status === HttpStatus.SUCCESS)
                setSummaryGradeStudent(res.data);
        } catch ($errors) {

        } finally { setLoadingStudentSumary(false); }
    }

    useEffect(() => {
        fetchSummaryGradesMyStudent();
    }, [])
    return (
        <>
            <h2 style={{ textAlign: 'center', color: '#1e3a8a' }}>KẾT QUẢ HỌC TẬP</h2>
            <ProfileStudent />
            {loadingStudentSummary ? <Loading /> :
                <div className="my-student-summary-container">
                    <div className="my-student-summary">
                        {
                            summaryGradeStudent.length > 0 ?
                                <>
                                    {summaryGradeStudent.map((semester: any, item) => (
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
            }

        </>
    )
}

export default SummaryGrade