import './HomePage.css';
import TearcherItem from '../../components/ui/BoxItem';

const HomePage = () => {

    return (
        <>
            <section className="hero">
                <h2>Chào Mừng Đến Với Khoa Công Nghệ Thông Tin</h2>
                <p>Để tra cứu thông tin học tập như điểm số, thời khóa biểu, thông báo và tài liệu học tập, sinh viên vui lòng truy cập vào trang thông tin của giảng viên bên dưới.</p>
            </section>

            <section className="teacher-list container">
                <h3>Danh Sách Giảng Viên</h3>
                <div className="card-grid">
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                    <TearcherItem href="lehuvinh">Lê Hữu vinh</TearcherItem>
                </div>
            </section>


        </>
    )
}

export default HomePage