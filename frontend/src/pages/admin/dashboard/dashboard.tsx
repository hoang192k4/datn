
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
                        <div className="stat-icon classNamees">🎓</div>
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

            <TeacherSchedule />
        </>
    )
}

export default Dashboard