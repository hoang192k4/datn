import './NotFoundPage.css';
import { Link } from "react-router-dom";
const NotFoundPage = () => {
    return (
        <>
            <div className="notfound-container">
                <div className="notfound-icon">🎓</div>
                <h1 className="notfound-title">404</h1>
                <h2 className="notfound-subtitle">Không tìm thấy trang</h2>
                <p className="notfound-description">
                    Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Vui lòng quay lại trang chủ để tiếp tục sử dụng hệ thống.
                </p>
                <Link to="/" className="notfound-home-link">Quay lại trang chủ</Link>
            </div>
        </>
    )
}
export default NotFoundPage