import { ReadStatus } from "../../../enums/ReadStatus";

interface StudentNotification {
    id: number,
    title: string,
    content: string,
    created_at: string,
    sender: string,
    from: string,
    status: string,
    student: Student
}

interface Student {
    id: string,
    name: string,
    student_code: string
}
interface Props {
    notification: StudentNotification;
    onDelete: () => void;
    onEdit: () => void;
}

const StudentNotificationItem: React.FC<Props> = ({ notification, onDelete, onEdit }) => {
    console.log(notification);
    return (
        <div className="notification-content">
            <div className="notification-main">
                <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>
                    <span className={`badge ${notification.status === 'read' ? 'badge-success' :
                        'badge-warning'
                        }`}>
                        {notification.status == ReadStatus.Read ? 'Đã đọc' : 'Chưa đọc'}
                    </span>
                </div>
                <p className="notification-description">
                    {notification.content}
                </p>
                <div className="notification-meta">
                    <div className="meta-item">
                        <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{notification.sender}</span>
                    </div>
                    <div className="meta-item">
                        <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{notification.created_at}</span>
                    </div>
                    <div className="meta-item">
                        <span><strong>Sinh viên nhận:</strong> {notification.student.name}</span>
                    </div>

                </div>
            </div>
            <div className="notification-actions">
                <button className="action-btn view">
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                </button>
                <button className="action-btn edit" onClick={() => onEdit()}>
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
                <button className="action-btn delete" onClick={() => onDelete()}>
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
}


export default StudentNotificationItem;