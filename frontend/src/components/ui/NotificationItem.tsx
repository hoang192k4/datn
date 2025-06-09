
interface Props {
    notification: {
        title: string,
        content: string,
        dateSend: string,
        to: string
    }
}
const NotificationItem = ({ notification }: Props) => {
    return (
        <>
            <div className="notification-card">
                <div className="notification-title">{notification.title}</div>
                <div className="notification-meta">Ngày gửi: {notification.dateSend} - {notification.to}</div>
                <div className="notification-content">{notification.content}</div>
            </div>
        </>
    )
}

export default NotificationItem