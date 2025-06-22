import type { CourseSection } from "../../../types/courseSecion"

interface PropsClass{
    course_section:CourseSection
}

const ClassCard = (props : PropsClass) => {
    return (
        <>
            <div className="class-card">
                <h3>Lớp học: {props.course_section.name}</h3>
                <div className="class-card-subject">Môn học: {props.course_section.subject}</div>
                <p>Tống số sinh viên : {props.course_section.students_total}</p>
                <p>Ngày bắt đầu: {props.course_section.start_date}</p>
                <button>Xem danh sách sinh viên</button>
            </div>
        </>
    )
}

export default ClassCard