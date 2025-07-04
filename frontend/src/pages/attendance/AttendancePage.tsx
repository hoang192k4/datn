import { useEffect, useMemo, useState } from 'react';
import './AttendancePage.css';
import { getListAttendanceStudent } from '../../services/attendanceService';


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

const AttendancePage = (props: any) => {
    const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);

    const fetch = async () => {
        try {
            const res = await getListAttendanceStudent(props.id);
            setStudentAttendance(res.data);
        } catch (error: any) {

        }
    }

    useEffect(() => {
        fetch();
    }, [])

    const sessions = useMemo(() => {
        const sessionMap = new Map<number, string>();

        studentAttendance.forEach(student => {
            student.attendance?.forEach(att => {
                if (!sessionMap.has(att.session_id)) {
                    sessionMap.set(att.session_id, att.session_date);
                }
            });
        });

        return Array.from(sessionMap.entries()).sort(
            (a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime()
        );
    }, [studentAttendance]);

    const statusIcons: Record<string, string> = {
        present: '✅',
        late: '⚠️',
        absent: '❌',
        excused_absent: '📝',
    }

    return (
        <><div className="attendance-page container">
            <h1>Danh sách điểm danh - {props.courseSecion?.name}</h1>
            <div style={{ marginBottom: '15px', fontSize: '16px' }}>
                ✅ <span className="present">Có mặt</span> &nbsp;&nbsp;
                ⚠️ <span className="late">Trễ</span> &nbsp;&nbsp;
                ❌ <span className="absent">Vắng</span> &nbsp;&nbsp;
                📝 <span className="excused">Vắng có phép</span>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>MSSV</th>
                        <th>Họ tên</th>
                        {sessions.map(([sessionId, date], index) => (
                            <th key={sessionId}>
                                Buổi {index + 1}
                                <br />
                                <small>{date}</small>
                            </th>
                        ))}
                        <td>Có mặt</td>
                    </tr>
                </thead>
                <tbody>
                    {studentAttendance.length > 0 ? (studentAttendance.map((student) => (
                        <tr key={student.id}>
                            <td>{student.student_code}</td>
                            <td>{student.name}</td>
                            {sessions.map(([sessionId]) => {
                                const att = student.attendance?.find(a => a.session_id === sessionId);
                                const status = att?.status || null;
                                const icon = statusIcons[status ?? ''] || '--';

                                return (
                                    <td key={sessionId} className={status || ''}>
                                        {icon}
                                        {att?.note && <br />}
                                        {att?.note && <small>{att.note}</small>}
                                    </td>
                                );
                            })}
                            <td>{student.attendance_score}</td>
                        </tr>

                    ))) : <tr><td colSpan={3}>Lớp học này chưa có buổi điểm danh nào</td></tr>}
                </tbody>
            </table>
        </div>

        </>
    )
}

export default AttendancePage