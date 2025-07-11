
import { useEffect, useState } from 'react';
import PageHeader from '../../../components/ui/PageHeader';
import { getStatisticsForAdmin } from '../../../services/statisticsService';
import TeacherSchedule from '../schedule/TeacherSchedule';
import './dashboard.css';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TeacherRole } from '../../../enums/TeacherRole';


interface StatisticsAdmin {
    total_students: number,
    total_teachers: number,
    total_course_sections: number,
    total_posts: number,
}
const Dashboard = () => {
    const [statistics, setStatistics] = useState<StatisticsAdmin>({ total_teachers: 0, total_course_sections: 0, total_students: 0, total_posts: 0 });
    const user = useSelector((state: any) => state.auth.user);

    const fetchDasboard = async () => {
        try {
            const res = await getStatisticsForAdmin(user.role);
            setStatistics(res.data);
        } catch (error: any) {
            console.log(error);
        }
    }

    const url = user.slug;
    useEffect(() => {
        fetchDasboard();
    }, []);
    return (
        <>
            <PageHeader title="Dashboard" subtitle="Tổng quan về dashboard" />
            {(user.role == TeacherRole.FacultyAdmin || user.role == TeacherRole.DepartmentAdmin) ? (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <Link to={`/${url}/sinh-vien`}>
                                <div>
                                    <div className="stat-number">{statistics.total_students}</div>
                                    <div className="stat-label">Tổng Sinh Viên Đang Học</div>
                                    {/* <div className="stat-trend">↗ +12 so với tháng trước</div> */}
                                </div>
                                <div className="stat-icon students">👥</div>
                            </Link>

                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <Link to={`/${url}/giang-vien`}>
                                <div>
                                    <div className="stat-number">{statistics.total_teachers}</div>
                                    <div className="stat-label">Tổng Giảng Viên Đang Giảng Dạy</div>
                                    {/* <div className="stat-trend">↗ +12 so với tháng trước</div> */}
                                </div>
                                <div className="stat-icon students">👥</div>
                            </Link>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <Link to={`/${url}/lop-hoc-phan`}>
                                <div>
                                    <div className="stat-number">{statistics.total_course_sections}</div>
                                    <div className="stat-label">Lớp Học Phần Đang Hoạt Động</div>
                                </div>
                                <div className="stat-icon classNamees">🎓</div>
                            </Link>

                        </div>
                    </div>
                    {/* <div className="stat-card">
                        <div className="stat-header">
                            <div>
                                <div className="stat-number">8.2</div>
                                <div className="stat-label">Điểm Trung Bình</div>
                                <div className="stat-trend">↗ +0.3 điểm</div>
                            </div>
                            <div className="stat-icon average">⭐</div>
                        </div>
                    </div> */}
                </div>
            ) : <> </>}

            {(user.role == TeacherRole.SubjectTeacher || user.role == TeacherRole.HomeroomTeacher) ? (
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-header">
                            <Link to={`/${url}/lop-hoc`}>
                                <div>
                                    <div className="stat-number">{statistics.total_course_sections}</div>
                                    <div className="stat-label">Lớp Học Phần Đang Dạy</div>
                                </div>
                                <div className="stat-icon classNamees">🎓</div>
                            </Link>

                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-header">
                            <Link to={`/${url}/thong-bao/danh-sach`}>
                                <div>
                                    <div className="stat-number">{statistics.total_posts}</div>
                                    <div className="stat-label">Thông Báo Đến Các Lớp</div>
                                    {/* <div className="stat-trend">↗ +12 so với tháng trước</div> */}
                                </div>
                                <div className="stat-icon students">👥</div>
                            </Link>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <Link to={`/${url}/sinh-vien`}>
                                <div>
                                    <div className="stat-number">{statistics.total_students}</div>
                                    <div className="stat-label">Tổng Sinh Viên Đang Học</div>
                                    {/* <div className="stat-trend">↗ +12 so với tháng trước</div> */}
                                </div>
                                <div className="stat-icon students">👥</div>
                            </Link>

                        </div>
                    </div>
                    {/* <div className="stat-card">
                        <div className="stat-header">
                            <div>
                                <div className="stat-number">8.2</div>
                                <div className="stat-label">Điểm Trung Bình</div>
                                <div className="stat-trend">↗ +0.3 điểm</div>
                            </div>
                            <div className="stat-icon average">⭐</div>
                        </div>
                    </div> */}
                </div>
            ) : <> </>}
            <TeacherSchedule />

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
                    <ul className="upcoming-classes">
                        <li className="class-item">
                            <div className="class-info">
                                <h4>Lập trình Java</h4>
                                <div className="class-time">9:00 - 11:00 | Phòng A201</div>
                            </div>
                            <span className="class-status status-upcoming">Sắp tới</span>
                        </li>
                        <li className="class-item">
                            <div className="class-info">
                                <h4>Cấu trúc dữ liệu</h4>
                                <div className="class-time">13:30 - 15:30 | Phòng B105</div>
                            </div>
                            <span className="class-status status-upcoming">Sắp tới</span>
                        </li>
                        <li className="class-item">
                            <div className="class-info">
                                <h4>Thực hành CSDL</h4>
                                <div className="class-time">15:45 - 17:45 | Lab C301</div>
                            </div>
                            <span className="class-status status-upcoming">Hôm nay</span>
                        </li>
                        <li className="class-item">
                            <div className="class-info">
                                <h4>Seminar AI</h4>
                                <div className="class-time">9:00 - 10:30 | Hội trường</div>
                            </div>
                            <span className="class-status status-upcoming">Ngày mai</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Dashboard