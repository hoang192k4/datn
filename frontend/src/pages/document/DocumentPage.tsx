import { Link } from 'react-router-dom';
import './DocumentPage.css';
const DocumentPage = () => {
    return (
        <>
            <div className="document-subject container">
                <h1>Tài liệu môn nhập môn lập trình</h1>
                <h2>Chương 1: Nhập môn lập trình</h2>
                <div className="lecture">
                    <Link to="#" className="lecture-title">Bài 1: Tổng quan về lập trình</Link>
                </div>
                <div className="lecture">
                    <Link to="#" className="lecture-title">Bài 2: Cấu trúc chương trình C</Link>
                </div>
                <div className="lecture">
                    <Link to="#" className="lecture-title">Bài 3: Biến và kiểu dữ liệu</Link>
                </div>
                  <h2>Chương 2: Làm quen với C++</h2>
                <div className="lecture">
                    <Link to="#" className="lecture-title">Bài 4: Tổng quan về lập trình</Link>
                </div>
                <div className="lecture">
                    <Link to="#" className="lecture-title">Bài 5: Cấu trúc chương trình C</Link>
                </div>
                <div className="lecture">
                    <Link to="#" className="lecture-title">Bài 6: Biến và kiểu dữ liệu</Link>
                </div>
            </div>
        </>
    )
}

export default DocumentPage