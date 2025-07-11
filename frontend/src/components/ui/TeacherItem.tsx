import { Link } from "react-router-dom";

interface subject {
    value: string;
    label: string;
}
interface TeacherProps {
    href: string,
    teacher_name: string;
    teacher_email: string;
    subjects: subject[];
}

const TeacherItem: React.FC<TeacherProps> = ({ href, teacher_name, subjects, teacher_email }) => {
    return (
        <>
            <Link className="card teacher-card" to={href}>
                <h4>{teacher_name}</h4>
                <div className="teacher-email">Email: {teacher_email}</div>
                <div>
                    <div className="teacher-subject-title">Môn phụ trách:</div>
                    {subjects.length > 0 ? (
                        <>
                            <ul className="teacher-subject-list">
                                {subjects.slice(0, 3).map((item) => (
                                    <li key={item.value}>{item.label}</li>
                                ))}
                            </ul>
                            {subjects.length > 3 && <div className="teacher-subject-more">+ {subjects.length - 3} môn khác</div>}
                        </>
                    ) : (
                        <div className="teacher-subject-none">(Chưa được phân công môn phụ trách)</div>
                    )}
                </div>
            </Link>
        </>
    )
}

export default TeacherItem