
import PageHeader from '../../../components/ui/PageHeader';
import TeacherSchedule from '../schedule/TeacherSchedule';
import './dashboard.css';



const Dashboard = () => {
    return (
        <>
            <PageHeader title="Dashboard" subtitle="tổng quan về dashboard" />
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-number">142</div>
                            <div className="stat-label">Tổng Sinh Viên</div>
                            <div className="stat-trend">↗ +12 so với tháng trước</div>
                        </div>
                        <div className="stat-icon students">👥</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-number">8</div>
                            <div className="stat-label">Lớp Học</div>
                            <div className="stat-trend">↗ +2 lớp mới</div>
                        </div>
                        <div className="stat-icon classNamees">📚</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-number">24</div>
                            <div className="stat-label">Bài Tập Chưa Chấm</div>
                            <div className="stat-trend">↓ -5 so với tuần trước</div>
                        </div>
                        <div className="stat-icon assignments">📝</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-header">
                        <div>
                            <div className="stat-number">8.2</div>
                            <div className="stat-label">Điểm Trung Bình</div>
                            <div className="stat-trend">↗ +0.3 điểm</div>
                        </div>
                        <div className="stat-icon average">⭐</div>
                    </div>
                </div>
            </div>


            <div className="dashboard-grid">
               
                    <TeacherSchedule />
        

                <div className="dashboard-card">
                    <h2 className="card-title">
                        <span>📅</span>
                        Lịch Học Sắp Tới
                    </h2>
                    <ul className="upcoming-classNamees">
                        <li className="className-item">
                            <div className="className-info">
                                <h4>Lập trình Java</h4>
                                <div className="className-time">9:00 - 11:00 | Phòng A201</div>
                            </div>
                            <span className="className-status status-upcoming">Sắp tới</span>
                        </li>
                        <li className="className-item">
                            <div className="className-info">
                                <h4>Cấu trúc dữ liệu</h4>
                                <div className="className-time">13:30 - 15:30 | Phòng B105</div>
                            </div>
                            <span className="className-status status-upcoming">Sắp tới</span>
                        </li>
                        <li className="className-item">
                            <div className="className-info">
                                <h4>Thực hành CSDL</h4>
                                <div className="className-time">15:45 - 17:45 | Lab C301</div>
                            </div>
                            <span className="className-status status-upcoming">Hôm nay</span>
                        </li>
                        <li className="className-item">
                            <div className="className-info">
                                <h4>Seminar AI</h4>
                                <div className="className-time">9:00 - 10:30 | Hội trường</div>
                            </div>
                            <span className="className-status status-upcoming">Ngày mai</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Dashboard