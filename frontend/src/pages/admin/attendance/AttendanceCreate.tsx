import { useEffect, useState } from "react";
import {
    createUpdateAttendances, getListAttendancesBySession
} from "../../../services/attendanceService";
import Loadding from "../../../components/ui/Loadding";
import type { StudentAttendace, AttendanceForm, SessionAttendance } from "../../../types/attendance";
import { useForm } from "react-hook-form";
import { IoMdArrowRoundBack } from "react-icons/io";
import Swal from "sweetalert2";
import type { AttendanceStatus } from "../../../enums/AttendanceStatus";
import { FaSearch } from "react-icons/fa";
import { getListStudentByCourseSection } from "../../../services/courseSectionService";
import { normalizeString } from "../../../utils/searchUtil";
interface AttendanceProps {
    classId: number,
    currentClassName?: string,
    action: 'default' | 'update' | 'create';
    listSession: SessionAttendance[];
    setAction: React.Dispatch<React.SetStateAction<'default' | 'update' | 'create'>>;
}

interface AttendanceUpdate {
    student_id: number,
    student_code: string,
    student_name: string,
    status: AttendanceStatus,
    note: string
}

interface AttendancesSession {
    id: number,
    session_study_date: string,
    attendances?: AttendanceUpdate[]
}
const AttendanceCreate = ({ classId, currentClassName, setAction, action, listSession }: AttendanceProps) => {
    const [loadingAttendanceCreate, setLoadingAttendanceCreate] = useState(false);
    const [listStudent, setListStudent] = useState<StudentAttendace[]>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AttendanceForm>();
    const [listAttendances, setListAttendances] = useState<AttendancesSession>();
    const [defaultSeclect, setDefaultSelect] = useState<number>();
    const [searchKeywordUpdateCreate, setSearchKeywordUpdateCreate] = useState<string>('');

    const feactListStudent = async () => {
        try {
            setLoadingAttendanceCreate(true);
            const res = action === 'create' &&
                await getListStudentByCourseSection(classId)
            if (res) {
                setListStudent(res.data);
            }
        } catch (errors) {
            console.log(errors);
        } finally { setLoadingAttendanceCreate(false); }
    }


    useEffect(() => {
        if (action === 'create')
            feactListStudent();
    }, [classId]);

    const handleSubmitAttendance = async (data: any) => {
        if (data.attendances) {
            try {
                console.log(data);
                const res = await createUpdateAttendances(data.session_id, data.attendances);
                if (res) {
                    Swal.fire({
                        title: action === 'create' ? "Điểm danh thành công!" : "Cập nhật điểm danh thành công",
                        icon: "success",
                        draggable: true
                    });
                    setAction('default');
                }
            } catch (erorrs) {
                console.log(errors)
            }
        }
    }
    const handleSelectSession = async (sessionId: number) => {
        if (action === 'update') {
            try {
                setLoadingAttendanceCreate(true);
                const res = await getListAttendancesBySession(sessionId);
                setListAttendances(res.data);
                console.log(res.data);
                setDefaultSelect(sessionId);
                reset(res.data);
            } catch (errors) {
                console.log(errors);
            } finally { setLoadingAttendanceCreate(false); }
        }
    }
    return (
        <>
            {loadingAttendanceCreate && <Loadding />}
            <div className="attendance-form-wrapper">
                <div className="attendance-form-wrapper-header">
                    <div className="attendance-form-wrapper-left">
                        <span onClick={() => setAction('default')}><IoMdArrowRoundBack /></span>
                        <h2>Điểm Danh Lớp {currentClassName}</h2>
                    </div>
                    <div className="attendance-search-student">
                        <input type="text" id="search-student" placeholder="Tìm kiếm sinh viên..." onChange={(e) => setSearchKeywordUpdateCreate(e.target.value)} />
                        <FaSearch />
                    </div>
                    <div className="attendance-form-wrapper-right">
                        <select {...register("session_id", { required: "Vui lòng chọn buổi điểm danh" })} value={defaultSeclect} onChange={(e: any) => handleSelectSession(e.target.value)} >
                            <option value="">--Chọn buổi điểm danh--</option>
                            {listSession.flat()?.map((session: SessionAttendance, index: number) => {
                                const sessionDate = new Date(session.study_date);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                sessionDate.setHours(0, 0, 0, 0);
                                const isFuture = action === 'create' ? sessionDate >= today :
                                    action === 'update' && sessionDate <= today
                                return (
                                    <option key={session.id} value={session.id} disabled={!isFuture}>Buổi {index + 1} - {session.study_date}</option>
                                )
                            })}
                        </select>
                        {errors.session_id && <p className="error-message">{errors.session_id.message}</p>}
                    </div>
                </div>
                <div id="attendance-form">
                    <table>
                        <thead>
                            <tr>
                                <th>MSSV</th>
                                <th>Name</th>
                                <th>✅ Có mặt</th>
                                <th>⚠️ Đi trễ</th>
                                <th>📝 Vắng có phép</th>
                                <th>❌ Vắng</th>
                                <th>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {action === 'create' ?
                                listStudent && listStudent?.filter(student => normalizeString(student.name).includes(normalizeString(searchKeywordUpdateCreate)) ||
                                    student.student_code.toLowerCase().includes(searchKeywordUpdateCreate.toLowerCase()))
                                    ?.map((student, index) => (
                                        <tr key={index} className={errors.attendances?.[index]?.status ? 'error-row' : ''}>
                                            <td>{student.student_code}</td>
                                            <td>{student.name}<input type="hidden" {...register(`attendances.${index}.student_id`, {
                                                required: "Chọn trạng thái điểm danh",
                                            })} value={student.id} /></td>
                                            <td>
                                                <input type="radio"
                                                    {...register(`attendances.${index}.status`, {
                                                        required: 'Vui lòng chọn trạng thái',
                                                    })} value="present" />
                                            </td>
                                            <td><input type="radio" {...register(`attendances.${index}.status`)} value="late" /></td>
                                            <td ><input type="radio" {...register(`attendances.${index}.status`)} value="excused_absent" /></td>
                                            <td ><input type="radio" {...register(`attendances.${index}.status`)} value="absent" /></td>
                                            <td><textarea {...register(`attendances.${index}.note`)} placeholder="Ghi chú..."></textarea></td>
                                        </tr>
                                    )) :
                                action === 'update' &&
                                listAttendances?.attendances?.filter(student => student.student_code.toLowerCase().includes(searchKeywordUpdateCreate.toLowerCase()) ||
                                    normalizeString(student.student_name).includes(normalizeString(searchKeywordUpdateCreate)))
                                    .map((attendance, index) => (
                                        <tr key={index} className={errors.attendances?.[index]?.status ? 'error-row' : ''}>
                                            <td>{attendance.student_code}</td>
                                            <td>{attendance.student_name}<input type="hidden" {...register(`attendances.${index}.student_id`, {
                                                required: "Chọn trạng thái điểm danh",
                                            })} value={attendance.student_id} /></td>
                                            <td>
                                                <input type="radio"
                                                    {...register(`attendances.${index}.status`, {
                                                        required: 'Vui lòng chọn trạng thái',
                                                    })} value="present" />
                                            </td>
                                            <td><input type="radio" {...register(`attendances.${index}.status`)} value="late" /></td>
                                            <td ><input type="radio" {...register(`attendances.${index}.status`)} value="excused_absent" /></td>
                                            <td ><input type="radio" {...register(`attendances.${index}.status`)} value="absent" /></td>
                                            <td><textarea {...register(`attendances.${index}.note`)} placeholder="Ghi chú..."></textarea></td>
                                        </tr>
                                    ))}
                            {Array.isArray(listAttendances?.attendances) && listAttendances.attendances.length === 0 && (
                                <tr>
                                    <td colSpan={7} style={{ textAlign: 'center' }}>Chưa có danh sách điểm danh</td>
                                </tr>
                            )}


                        </tbody>
                    </table>
                    <button type="button" onClick={handleSubmit(handleSubmitAttendance)} >Gửi điểm danh</button>
                </div>
            </div >
        </>
    )
}

export default AttendanceCreate