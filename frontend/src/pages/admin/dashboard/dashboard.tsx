import { useEffect, useState } from 'react';
import './dashboard.css';
import { getFCMToken } from '../../../services/deviceTokenService';


const Dashboard = () => {
    const [permission, setPermission] = useState('default');
    useEffect(() => {
        getFCMToken([permission, setPermission]);
    }, []);
    return (
        <>
            <div className="main-content">
                <div className="page-header">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Tổng quan về hoạt động giảng dạy và quản lý lớp học</p>
                </div>


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
                    <div className="dashboard-card">
                        <h2 className="card-title">
                            <span>📋</span>
                            Hoạt Động Gần Đây
                        </h2>
                        <ul className="recent-activities">
                            <li className="activity-item">
                                <div className="activity-time">2 giờ trước</div>
                                <div className="activity-desc">Đã chấm điểm bài tập môn Java cho lớp IT2021A</div>
                            </li>
                            <li className="activity-item">
                                <div className="activity-time">5 giờ trước</div>
                                <div className="activity-desc">Thêm tài liệu bài giảng chương 8 - Cấu trúc dữ liệu</div>
                            </li>
                            <li className="activity-item">
                                <div className="activity-time">1 ngày trước</div>
                                <div className="activity-desc">Tạo thông báo về lịch kiểm tra giữa kỳ</div>
                            </li>
                            <li className="activity-item">
                                <div className="activity-time">2 ngày trước</div>
                                <div className="activity-desc">Cập nhật điểm danh cho 3 lớp học</div>
                            </li>
                            <li className="activity-item">
                                <div className="activity-time">3 ngày trước</div>
                                <div className="activity-desc">Phản hồi câu hỏi của sinh viên trên diễn đàn</div>
                            </li>
                        </ul>
                    </div>


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
            </div>
        </>
    )
}

export default Dashboard