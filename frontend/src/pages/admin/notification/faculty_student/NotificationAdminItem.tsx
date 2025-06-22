
interface Notification {
    id: number;
    title: string;
    content: string;
    created_at: string;
    sender: string;
    status: string;
    from: string
}


interface Props {
    notification: Notification,
    onDelete: () => void;
}

const NotificationAdminItem: React.FC<Props> = ({ notification, onDelete }) => {
    return (
        <div className="notification-content">
            <div className="notification-main">
                <div className="notification-header">
                    <h3 className="notification-title">{notification.title}</h3>

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
                        <span><strong>Gửi từ:</strong> {notification.from}</span>
                    </div>

                </div>
            </div>
            <div className="notification-actions">
                <button className="action-btn delete" onClick={() => { onDelete() }}>
                    <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div >
    );
}


export default NotificationAdminItem