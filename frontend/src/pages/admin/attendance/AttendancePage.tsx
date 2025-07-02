import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import SelectWithPagination from "../../../components/ui/SelectWithPagination";
import { exportTemplateAttendance, getListAttendanceStudent, getListSessionsByCourseSection, importAttendance } from "../../../services/attendanceService";
import "./Attendance.css";
import AttendanceCreate from "./AttendanceCreate";
import { FaSearch } from "react-icons/fa";
import Swal from "sweetalert2";
import Loadding from "../../../components/ui/Loadding";
import type { SessionAttendance } from "../../../types/attendance";
import { normalizeString } from "../../../utils/searchUtil";

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
    attendance_score: string;
    attendance?: Attendance[];
}

const AttendancePage = () => {
    const [listStudentAttendance, setListStudentAttendance] = useState<StudentAttendance[]>([]);
    const [currentClassId, setCurrentClassId] = useState<number>();
    const [currentClassName, setCurrentClassName] = useState<string>();
    const [action, setAction] = useState<'create' | 'update' | 'default'>('default');
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [loadingAttendancePage, setLoadingAttendancePage] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [sessionByCourseSection, setSessionByCourseSection] = useState<SessionAttendance[]>([]);
    const [selectedSession, setSelectedSession] = useState<string>('');
    const [actionImportExport, setActionImpotExport] = useState<'import' | 'export' | 'default'>('default');

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
            setLoadingAttendancePage(true);
            const res = await getListAttendanceStudent(courseSectionId);
            setListStudentAttendance(res.data);
        } catch (errors) {
            console.log(errors);
        } finally { setLoadingAttendancePage(false); }

    };

    const fetchListSession = async (courseSectionId: number) => {
        const res = await getListSessionsByCourseSection(courseSectionId);
        setSessionByCourseSection(res.data.sessions);
    }

    useEffect(() => {
        if (currentClassId !== undefined) {
            fetchAttendance(currentClassId);
            fetchListSession(currentClassId);
        }

    }, [action, currentClassId])

    /* cập nhật state mặc định mỗi lần ẩn hiện popup import export */
    useEffect(() => {
        setSelectedSession('');
        setFile(null);
    }, [actionImportExport])

    const handleExport = async () => {
        if (selectedSession) {
            try {
                setLoadingAttendancePage(true);
                const response = await exportTemplateAttendance(Number(selectedSession));
                const contentDisposition = response.headers['content-disposition'];
                let fileName = 'attendance.xlsx';
                if (contentDisposition && contentDisposition?.includes('filename=')) {
                    fileName = contentDisposition.split('filename=')[1].replace(/["']/g, '');
                }

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', fileName);
                document.body.appendChild(link);
                link.click();
                link.remove();
                setActionImpotExport('default');
                Swal.fire({
                    title: 'Đã tải file thành công!',
                    icon: "success",
                    draggable: true
                })
            } catch (error) {
                console.error('Export thất bại:', error);
            } finally { setLoadingAttendancePage(false); }
        }
        else {
            Swal.fire({
                title: 'Vui lòng chọn buổi điểm danh',
                icon: "error",
            })
        }

    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleImport = async () => {
        if (!file) {
            Swal.fire({
                title: 'Vui lòng chọn tệp nhập điểm danh (Excel)',
                icon: "error",
            })
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        try {
            setLoadingAttendancePage(true);
            const res = await importAttendance(formData);
            if (res) {
                setActionImpotExport('default');
                Swal.fire({
                    title: res.message,
                    icon: "success",
                    draggable: true
                });
                if (currentClassId !== undefined)
                    fetchAttendance(currentClassId);
            }
        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message,
                icon: "error",
            })
        } finally { setLoadingAttendancePage(false); }
    }

    const sessions = useMemo(() => {
        const sessionMap = new Map<number, { id: number; date: string }>();

        listStudentAttendance?.forEach(student => {
            student.attendance?.forEach(att => {
                if (!sessionMap.has(att.session_id)) {
                    sessionMap.set(att.session_id, { id: att.session_id, date: att.session_date });
                }
            });
        });

        return Array.from(sessionMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [listStudentAttendance]);


    return <>
        {loadingAttendancePage && <Loadding />}
        <PageHeader title="📅 Quản lý điểm danh" subtitle="Hệ thống quản lý điểm danh của từng lớp học" />
        {
            actionImportExport !== 'default' &&
            <div className="popup-export-import">
                <div>
                    {
                        actionImportExport === 'export' ?
                            <>
                                <h2>Tải xuống mẫu điểm danh (Excel)</h2>
                                <p>Vui lòng chọn buổi học để xuất tệp Excel mẫu. Bạn có thể điền trạng thái và ghi chú trước khi nhập lại hệ thống!</p>
                                <select onChange={(e) => setSelectedSession(e.target.value)}>
                                    <option value="">--Chọn buổi điểm danh--</option>
                                    {sessionByCourseSection.flat()?.map((session: SessionAttendance, index: number) => (
                                        <option value={session.id}>Buổi {index + 1} - {session.study_date}</option>
                                    ))}
                                </select>
                                <button className="btn-attendance" onClick={handleExport} >Tải xuống mẫu Excel</button>
                            </> :
                            <>
                                <h2>Nhập dữ liệu điểm danh từ tệp excel</h2>
                                <p>Vui lòng tải lên tệp Excel chứa thông tin điểm danh. Hệ thống sẽ tự động xử lý và ghi nhận dữ liệu tương ứng với buổi học!</p>
                                <input type="file" accept=".xlsx" onChange={handleFileChange} />
                                <button className="btn-attendance" onClick={handleImport}>Nhập điểm danh</button>
                            </>
                    }
                    <button className="btn-attendance-cancel" onClick={() => setActionImpotExport('default')}>Hủy</button>
                </div>
            </div>
        }
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
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <button className="btn-attendance" onClick={() => setActionImpotExport('export')}>Xuất mẫu điểm danh</button>
                                    <button className="btn-attendance" onClick={() => setActionImpotExport('import')}>Nhập điểm danh</button>
                                </div>
                            </div>
                            <div className="gm-class-select">
                                <SelectWithPagination handleClassSelection={handleSelection} />
                                <button className="btn-attendance" onClick={() => setAction('update')}>Chỉnh sửa điểm danh</button>
                                <button className="btn-attendance btn-attendance-right" onClick={() => setAction('create')}>Thêm điểm danh</button>
                            </div>
                        </div>
                        <div className="attendance-table-wrapper">
                            <table className="attendance-table">
                                <thead>
                                    <tr>
                                        <th>STT</th>
                                        <th>Thông tin sinh viên</th>
                                        {sessions.map((item, index) => (
                                            <th key={index}>
                                                Buổi {index + 1}
                                                <br />
                                                <small>{item.date}</small>
                                            </th>
                                        ))}
                                        <th>Có mặt</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listStudentAttendance.length > 0 ? listStudentAttendance.filter(student =>
                                        normalizeString(student.name).includes(normalizeString(searchKeyword)) ||
                                        student.student_code.toLowerCase().includes(searchKeyword.toLowerCase()))
                                        .map((student, index) => (
                                            <tr key={student.id}>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {student.name}
                                                    <br />
                                                    <small>MSSV: {student.student_code}</small>
                                                </td>
                                                {sessions.map((session) => {
                                                    const att = student.attendance?.find(a => a.session_id === session.id);
                                                    return (
                                                        <td key={session.id}>
                                                            {att ? (statusIcons[att.status] || '❓') : '--'}
                                                            <br />
                                                            <small>{att?.note || ''}</small>
                                                        </td>
                                                    );
                                                })}
                                                <td>{student.attendance_score}</td>
                                            </tr>
                                        )) :
                                        <tr><td colSpan={3}>Chưa có điểm danh nào</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </>
                    :
                    <AttendanceCreate classId={currentClassId} currentClassName={currentClassName} action={action} setAction={setAction} listSession={sessionByCourseSection} />
                }
            </div>
        }
    </>
}

export default AttendancePage