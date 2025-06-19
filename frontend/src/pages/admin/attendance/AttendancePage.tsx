import { useEffect, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import SelectWithPagination from "../../../components/ui/SelectWithPagination";
import { getListAttendanceStudent } from "../../../services/attendanceService";
import "./Attendance.css";
import AttendanceCreate from "./AttendanceCreate";
import { FaSearch } from "react-icons/fa";

interface Attendance {
    session_id: number,
    session_date: string;
    status: string;
    note: string;
}

interface StudentAttendance {
    id: number;
    name: string;
    student_code: string;
    attendance?: Attendance[];
}
const AttendancePage = () => {
    const [listStudentAttendance, setListStudentAttendance] = useState<Record<number, StudentAttendance>>({});
    const [currentClassId, setCurrentClassId] = useState<number>();
    const [currentClassName, setCurrentClassName] = useState<string>();
    const [action, setAction] = useState<'create' | 'update' | 'default'>('default');
    const [searchKeyword, setSearchKeyword] = useState<string>('');

    const handleSelection = (classId: { label: string, value: number }) => {
        setCurrentClassName(classId.label);
        setCurrentClassId(classId.value);
        fetchAttendance(classId.value);
    }

    const statusIcons: Record<string, string> = {
        present: '✅',
        late: '⚠️',
        absent: '❌',
        excused_absent: '📝',
    }
    const fetchAttendance = async (courseSectionId: number) => {
        try {
            const res = await getListAttendanceStudent(courseSectionId);
            setListStudentAttendance(res.data);
        } catch (errors) {
            console.log(errors);
        }

    };

    useEffect(() => {
        if (currentClassId !== undefined) {
            fetchAttendance(currentClassId);
        }
    }, [action])
    return <>
        <PageHeader title="📅 Quản lý điểm danh" subtitle="Hệ thống quản lý điểm danh của từng lớp học" />
        {!currentClassId ?
            <section className="gm-class-selection">
                <div className="gm-selection-icon">📚</div>
                <h2 className="gm-selection-title">Chọn lớp học</h2>
                <p className="gm-selection-subtitle">Vui lòng chọn lớp học để bắt đầu quản lý điểm danh</p>

                <div className="gm-class-select">
                    <SelectWithPagination handleClassSelection={handleSelection} />
                </div>
            </section>
            :
            <div className="attendance-students">
                {action === 'default' ?
                    <>
                        <div className="attendance-students-header">
                            <div>
                                <h2>Danh Sách Điểm Danh</h2>
                                <p style={{ fontSize: '18px', fontWeight: '600', color: '#2e3b8c', padding: '4px 0' }}>lớp {currentClassName && currentClassName}</p>
                                <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                                    ✅ <span className="present">Có mặt</span> &nbsp;&nbsp;
                                    ⚠️ <span className="late">Trễ</span> &nbsp;&nbsp;
                                    📝<span className="excused">Vắng có phép</span> &nbsp;&nbsp;
                                    ❌<span className="absent">Vắng</span>
                                </div>
                            </div>
                            <div className="attendance-search-student">
                                <input type="text" id="search-student" placeholder="Tìm kiếm sinh viên..." onChange={(e) => setSearchKeyword(e.target.value)} />
                                <FaSearch />
                            </div>
                            <div className="gm-class-select">
                                <SelectWithPagination handleClassSelection={handleSelection} />
                                <button className="btn-attendance" onClick={() => setAction('update')}>Chỉnh sửa điểm danh</button>
                                <button className="btn-attendance" onClick={() => setAction('create')}>Thêm điểm danh</button>
                            </div>
                        </div>
                        <div className="attendance-table-wrapper">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thông tin sinh viên</th>
                                        {listStudentAttendance[0]?.attendance?.map((item, idx) => (
                                            <th key={idx}>
                                                Buổi {idx + 1}
                                                <br />
                                                <small>{new Date(item.session_date).toLocaleDateString()}</small>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(listStudentAttendance).filter(student =>
                                        student.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
                                        student.student_code.toLowerCase().includes(searchKeyword.toLowerCase()))
                                        .map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {student.name}
                                                    <br />
                                                    <small>MSSV: {student.student_code}</small>
                                                </td>
                                                {student.attendance?.map((att, i) => (
                                                    <td key={i}>
                                                        {statusIcons[att.status] || '❓'}
                                                        <br />
                                                        <small>{att.note}</small>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                    :
                    <AttendanceCreate classId={currentClassId} currentClassName={currentClassName} action={action} setAction={setAction} />
                }
            </div>
        }
    </>
}

export default AttendancePage