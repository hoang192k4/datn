import React, { useEffect, useState } from 'react';
import './Notification.css'; // Import your CSS styles
import PageHeader from '../../../components/ui/PageHeader';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'react-tabs/style/react-tabs.css';
import { getMyNotifications } from '../../../services/notificationService';
import type { Paginate } from '../../../types/paginate';
import { HttpStatus } from '../../../enums/HttpStatus';
import { Loading } from '../../../components/ui/Loading';
import CreateNotificationModal from './CreateNotificationModal'
import { PublicStatus } from '../../../enums/PublicStatus';

interface NotificationCourseSection {
    id: string;
    title: string;
    content: string;
    created_at: string;
    teacher: string;
    course_section_name: string;
    status: string;
}

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationCourseSection[]>([]);


    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [paginate, setPaginate] = useState<Paginate>();
    const [loading, setLoading] = useState<boolean>(false);
    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);


    useEffect(() => {
        fetchMyNotifications({ page: 1, limit: 10 });
    }, []);
    const fetchMyNotifications = async ({ page, limit }: Paginate) => {
        try {
            setLoading(true);
            const response = await getMyNotifications({ page, limit });
            if (response.status === HttpStatus.SUCCESS) {
                const notifications = response.data.data.posts;
                const paginate = response.data.data.meta;
                console.log(notifications, paginate);
                setNotifications(notifications);
                setPaginate(paginate);
            }


        } catch (error: any) {

        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <PageHeader title='Thông Báo' subtitle='Quản lý thông báo của giảng viên' />
            <div className="notification-container">
                {/* Header */}
                <div className="header">
                    <div className="header-left">
                        <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V12h5v5z" />
                        </svg>
                        <h1 className="header-title">Thông Báo</h1>
                    </div>
                    <button className="btn-primary" onClick={() => setIsOpenCreateModal(true)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Tạo thông báo mới
                    </button>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Thông báo đến lớp</Tab>
                        <Tab>Thông báo đến sinh viên</Tab>
                    </TabList>
                    <TabPanel>


                        {/* Filters */}
                        <div className="filters">
                            <div className="filters-row">
                                <div className="search-container">

                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Tìm kiếm thông báo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}

                                    />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                                </div>
                                <select
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="published">Đã xuất bản</option>
                                    <option value="draft">Bản nháp</option>
                                    <option value="archived">Đã lưu trữ</option>
                                </select>
                                <select
                                    className="filter-select"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">Tất cả loại</option>
                                    <option value="info">Thông tin</option>
                                    <option value="warning">Cảnh báo</option>
                                    <option value="success">Thành công</option>
                                    <option value="error">Lỗi</option>
                                </select>
                            </div>
                        </div>

                        {/* Notifications List */}
                        {loading ? (<Loading />) : notifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <div className="notification-content">
                                    <div className="notification-main">
                                        <div className="notification-header">
                                            <h3 className="notification-title">{notification.title}</h3>
                                            {/* <span className={`badge ${notification.status === 'published' ? 'badge-published' :
                                        notification.status === 'draft' ? 'badge-draft' : 'badge-archived'
                                        }`}>
                                        {notification.status === 'published' ? 'Đã xuất bản' :
                                            notification.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                                    </span>
                                    */}
                                            <span className={`badge ${notification.status === PublicStatus.Public ? 'badge-success' :
                                                'badge-warning'

                                                }`}>
                                                {notification.status === PublicStatus.Public ? "Công khai" :
                                                    "Không công khai"
                                                }
                                            </span>
                                        </div>
                                        <p className="notification-description">
                                            {notification.content}
                                        </p>
                                        <div className="notification-meta">
                                            <div className="meta-item">
                                                <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{notification.teacher}</span>
                                            </div>
                                            <div className="meta-item">
                                                <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{notification.created_at}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span><strong>Đối tượng:</strong> {notification.course_section_name}</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        <button className="action-btn view">
                                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button className="action-btn edit">
                                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="action-btn delete">
                                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {paginate ? (<div className="pagination">
                            <div className="pagination-info">
                                Hiển thị <strong> {paginate?.from}</strong> đến <strong> {paginate?.to}</strong> trong tổng số <strong>{paginate?.total}</strong> thông báo
                            </div>
                            <div className="pagination-controls">
                                <button className="page-btn" onClick={() => fetchMyNotifications({ page: paginate?.previous_page, limit: 10 })}>Trước</button>
                                <button className="page-btn active">{paginate?.current_page}</button>
                                <button className="page-btn" onClick={() => fetchMyNotifications({ page: paginate?.next_page, limit: 10 })}>Sau</button>
                            </div>
                        </div>) : (<div> </div>)}

                    </TabPanel>
                    <TabPanel>
                        {/* Filters */}
                        <div className="filters">
                            <div className="filters-row">
                                <div className="search-container">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Tìm kiếm thông báo..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                                </div>
                                <select
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="published">Đã xuất bản</option>
                                    <option value="draft">Bản nháp</option>
                                    <option value="archived">Đã lưu trữ</option>
                                </select>
                                <select
                                    className="filter-select"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">Tất cả loại</option>
                                    <option value="info">Thông tin</option>
                                    <option value="warning">Cảnh báo</option>
                                    <option value="success">Thành công</option>
                                    <option value="error">Lỗi</option>
                                </select>
                            </div>
                        </div>

                        {/* Notifications List */}
                        {notifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <div className="notification-content">
                                    <div className="notification-main">
                                        <div className="notification-header">
                                            <h3 className="notification-title">{notification.title}</h3>
                                            {/* <span className={`badge ${notification.status === 'published' ? 'badge-published' :
                                        notification.status === 'draft' ? 'badge-draft' : 'badge-archived'
                                        }`}>
                                        {notification.status === 'published' ? 'Đã xuất bản' :
                                            notification.status === 'draft' ? 'Bản nháp' : 'Đã lưu trữ'}
                                    </span>
                                    <span className={`badge ${notification.type === 'info' ? 'badge-info' :
                                        notification.type === 'warning' ? 'badge-warning' :
                                            notification.type === 'success' ? 'badge-success' : 'badge-error'
                                        }`}>
                                        {notification.type === 'info' ? 'Thông tin' :
                                            notification.type === 'warning' ? 'Cảnh báo' :
                                                notification.type === 'success' ? 'Thành công' : 'Lỗi'}
                                    </span> */}
                                        </div>
                                        <p className="notification-description">
                                            {notification.content}
                                        </p>
                                        <div className="notification-meta">
                                            <div className="meta-item">
                                                <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                <span>{notification.teacher}</span>
                                            </div>
                                            <div className="meta-item">
                                                <svg className="meta-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span>{notification.created_at}</span>
                                            </div>
                                            <div className="meta-item">
                                                <span><strong>Đối tượng:</strong> {notification.course_section_name}</span>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="notification-actions">
                                        <button className="action-btn view">
                                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button className="action-btn edit">
                                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button className="action-btn delete">
                                            <svg className="action-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        <div className="pagination">
                            <div className="pagination-info">
                                Hiển thị <strong> {paginate?.from}</strong> đến <strong> {paginate?.to}</strong> trong tổng số <strong>{paginate?.total}</strong> thông báo
                            </div>
                            <div className="pagination-controls">
                                <button className="page-btn">Trước</button>
                                <button className="page-btn active">1</button>
                                <button className="page-btn">Sau</button>
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>
            </div >
            {isOpenCreateModal ? <CreateNotificationModal isOpen={isOpenCreateModal} onClose={() => { setIsOpenCreateModal(false) }} onSuccessTeacher={() => { fetchMyNotifications({ page: 1 }) }} /> : <> </>
            }
        </>
    )
}

export default Notification;