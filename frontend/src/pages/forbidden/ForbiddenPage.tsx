import '../notfound/NotFoundPage.css';
import { Link } from "react-router-dom";
const ForbiddenPage = () => {
    return (
        <>
            <div className="notfound-container">
                <div className="notfound-icon">🎓</div>
                <h1 className="notfound-title">403!</h1>
                <h2 className="notfound-subtitle">Không đuợc phép truy cập</h2>
                <p className="notfound-description">
                    Rất tiếc, bạn không đủ quyền truy cập vào trang này. Vui lòng quay lại trang chủ để tiếp tục sử dụng hệ thống.
                </p>
                <Link to="/" className="notfound-home-link">Quay lại trang chủ</Link>
            </div>
        </>
    )
}
export default ForbiddenPage