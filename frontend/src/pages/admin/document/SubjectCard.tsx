import { Link } from "react-router-dom";

interface Chapters {
    title: string;
    position: number;
}

interface SubjectCardProps {
    subject_name: string,
    id: number,
    chapters: Chapters[]
}
const SubjectCard = (props: SubjectCardProps) => {
    return (
        <>
            <div className="subject-card">
                <div className="subject-title">{props?.subject_name}</div>
                <div className="doc-list">
                    {props?.chapters?.map((item, index) => (
                        <div className="doc-item" key={index}>Chương {index + 1} 📄{item.title}</div>
                    ))}
                </div>
                <Link to={`tai-lieu-chi-tiet/${props.id}`} className="btn-add">Xem chi tiết</Link>
            </div>
        </>
    )
}

export default SubjectCard