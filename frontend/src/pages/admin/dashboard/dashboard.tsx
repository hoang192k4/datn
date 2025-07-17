
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
                                <div className="stat-icon classNamees">📚</div>
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
        </>
    )
}

export default Dashboard