import type { Post } from "../../types/post"

interface Props {
    post: Post
}
const NotificationItem = ({ post }: Props) => {
    return (
        <>
            <div className="notification-card">
                <div className="notification-title">{post.title}</div>
                <div className="notification-meta">Ngày gửi: {post.created_at} - {post.course_section.name}</div>
                <div className="notification-content">{post.content}</div>
            </div>
        </>
    )
}

export default NotificationItem