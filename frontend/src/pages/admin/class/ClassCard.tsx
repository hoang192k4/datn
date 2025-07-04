import type { CourseSection } from "../../../types/courseSecion"
import { formatDayMonthYear } from "../../../utils/utils";

interface PropsClass {
    course_section: CourseSection,
    setAction: React.Dispatch<React.SetStateAction<'default' | 'student_list'>>,
    setCurrentClassId: React.Dispatch<React.SetStateAction<number | null>>,
    setCurrentClassName: React.Dispatch<React.SetStateAction<string>>,
}

const ClassCard = (props: PropsClass) => {
    const handleStudentList = (courseSectionId: number, name: string, studentTotal: number) => {
        props.setAction('student_list');
        props.setCurrentClassId(courseSectionId);
        props.setCurrentClassName(name + '- ' + studentTotal + ' sinh viên');
    }
    return (
        <>
            <div className="class-card">
                <h3>Lớp học: {props.course_section.name}</h3>
                <div className="class-card-subject">
                    Môn học: {props.course_section.subject}
                    <span> (Tổng số sinh viên : {props.course_section.students_total})</span>
                </div>
                <p>Ngày bắt đầu: {formatDayMonthYear(props.course_section.start_date)}</p>
                <p>{props.course_section.semester.name}</p>
                <button onClick={() => handleStudentList(props.course_section.id, props.course_section.name, props.course_section.students_total)}>Xem danh sách sinh viên</button>
            </div>
        </>
    )
}

export default ClassCard