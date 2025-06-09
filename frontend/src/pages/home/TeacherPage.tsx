import BoxItem from "../../components/ui/BoxItem";
import NotificationItem from "../../components/ui/NotificationItem"
import './TeacherPage.css';
const TeacherPage = () => {
    const demoThongBao = [
        {
            title: 'giáo trình c',
            content: 'content cua giao trinh c',
            dateSend: '2025-06-10',
            to: 'Từ phòng đào tạo',
        },
        {
            title: 'giáo trình A',
            content: 'content cua giao trinh A',
            dateSend: '2025-06-10',
            to: 'đến lớp CĐ TH 22 A',
        },
        {
            title: 'giáo trình B',
            content: 'content cua giao trinh B',
            dateSend: '2025-06-10',
            to: 'Từ phòng đào tạo',
        }
    ]
    return (
        <>
            <main className="container teacher-page">
                <section className="notification">
                    <h2>Thông Báo Gần Đây</h2>
                    <div className="notification-list">
                        {demoThongBao ? demoThongBao.map((item, index) => (
                            <NotificationItem
                                key={index}
                                notification={item}
                            />
                        )) : <p>Không có bất kì thông báo nào gần đây</p>}
                    </div>
                </section>

                <div className="class-list">
                    <h2>Danh Sách Lớp Học</h2>
                    <div className="card-grid">
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH23A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22B</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22C</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                        <BoxItem href="CĐTH22A">CĐTH22A</BoxItem>
                    </div>
                </div>
                <div className="document-subject-list">
                    <h2>Tài Liệu Môn Học</h2>
                    <div className="card-grid">
                        <BoxItem href="#">Nhập môn lập trình</BoxItem>
                        <BoxItem href="#">Cấu trúc dữ liệu giải thuật</BoxItem>
                        <BoxItem href="#">Lập trình hướng đối tượng</BoxItem>
                        <BoxItem href="#">Lập trình PHP</BoxItem>
                    </div>
                </div>
            </main>
        </>
    )
}

export default TeacherPage