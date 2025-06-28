import type { StudentList } from "../../../types/student";
import { formatDayMonthYear } from "../../../utils/stringUtil";
import { genderText } from "../../../utils/studentText";
import { FaRegEdit } from "react-icons/fa";
import StudentStatusBadge from "./StudentStatusBadge";


interface Props {
    student: StudentList;
    onEdit: (student: StudentList) => void;
    setTypeModal: () => void;
    index: number,
}

const StudentItem = ({ student, onEdit, setTypeModal, index }: Props) => {
    return (
        <>
            <td style={{ textAlign: 'center' }}>{index}</td>
            <td style={{ textAlign: 'center' }}>{student.student_code}</td>
            <td>{student.email}</td>
            <td>{student.name}</td>
            <td>{formatDayMonthYear(student.date_of_birth)}</td>
            <td>{student.address}</td>
            <td>{genderText[student.gender]}</td>
            <td>{formatDayMonthYear(student.enrollment_date)}</td>
            <td>{student.graduation_date ? formatDayMonthYear(student.graduation_date) : 'Chưa tốt nghiệp'}</td>
            <td>{student.major}</td>
            <td> <StudentStatusBadge status={student.status} /></td>
            <td style={{ textAlign: 'center' }}> <button className="btn-primary-student" type="button" onClick={() => { onEdit(student); setTypeModal() }}> <FaRegEdit /> </button></td>
        </>
    );
}

export default StudentItem;