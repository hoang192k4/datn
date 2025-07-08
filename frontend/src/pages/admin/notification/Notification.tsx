import React, { useEffect, useState } from 'react';
import './Notification.css'; // Import your CSS styles
import PageHeader from '../../../components/ui/PageHeader';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'react-tabs/style/react-tabs.css';
import { deleteNotification, deletePost, getMyNotifications, getStudentNotifications } from '../../../services/notificationService';
import type { Paginate } from '../../../types/paginate';
import { HttpStatus } from '../../../enums/HttpStatus';
import { Loading } from '../../../components/ui/Loading';
import CreateNotificationModal from './CreateNotificationModal';
import NotificationItem from './NotificationItem';
import StudentNotificationItem from './StudentNotificationItem';
import EditNotificationModal from './EditNotificationModal';

import Swal from 'sweetalert2';
import EditStudentNotificationModal from './EditStudentNotificationModal';

interface NotificationCourseSection {
    id: number;
    title: string;
    content: string;
    created_at: string;
    teacher: string;
    course_section: CourseSection;
    status: string;
}


interface CourseSection {
    id: number,
    name: string,
}
interface Student {
    id: string,
    name: string,
    student_code: string
}
interface StudentNotification {
    id: number,
    title: string,
    content: string,
    created_at: string,
    sender: string,
    from: string,
    status: string,
    student: Student
}

const Notification: React.FC = () => {
    const [notifications, setNotifications] = useState<NotificationCourseSection[]>([]);
    const [studentNotifications, setStudentNotifications] = useState<StudentNotification[]>([]);
    const [studentNotifyPaginate, setStudentNotifyPaginate] = useState<Paginate>();
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [filterStudentStatus, setFilterStudentStatus] = useState<string>('');
    const [paginate, setPaginate] = useState<Paginate>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStudentNotify, setLoadingStudentNotify] = useState<boolean>(false)
    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<NotificationCourseSection>();
    const [keywordPost, setKeywordPost] = useState<string>('');
    const [keywordPostDebounce, setKeywordPostDebounce] = useState<string>('');
    const [editStudentNotification, setEditStudentNotification] = useState<StudentNotification>();
    const [isOpenStudentNotificationModal, setIsOpenStudentNotificationModal] = useState<boolean>(false);
    const [keywordNotification, setKeywordNotification] = useState<string>('');
    const [keywordNotificationDebounce, setKeywordNotificationDebounce] = useState<string>('');
    const [page, setPage] = useState<number | null | undefined>(1);

    const fetchMyNotifications = async ({ page, limit, key }: Paginate, status: string) => {
        try {
            setLoading(true);
            const response = await getMyNotifications({ page, limit, key }, status);
            if (response.status === HttpStatus.SUCCESS) {
                const notifications = response.data.data.posts;
                const paginate = response.data.data.meta;
                setNotifications(notifications);
                setPaginate(paginate);
            }

        } catch (error: any) {

        } finally {
            setLoading(false);
        }
    }

    const fetchStudentNotifications = async ({ page, limit, key }: Paginate, status: string) => {
        try {
            setLoadingStudentNotify(true);
            const response = await getStudentNotifications({ page, limit, key }, status);
            if (response.status === HttpStatus.SUCCESS) {
                const notifications = response.data.data.notifications;
                const paginate = response.data.data.meta;
                setStudentNotifications(notifications);
                setStudentNotifyPaginate(paginate);
            }

        } catch (error: any) {

        } finally {
            setLoadingStudentNotify(false);
        }
    }

    const handleDeleteNotification = async (id: number) => {
        Swal.fire({
            title: 'Bạn chắc chắn xóa thông báo này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vâng, hãy xóa!"
        }).then(async (results) => {
            if (results.isConfirmed) {
                try {
                    const response = await deleteNotification(id);
                    if (response.status === HttpStatus.SUCCESS) {
                        Swal.fire({
                            title: 'Xóa thông báo thành công',
                            icon: 'success',
                        });
                        setStudentNotifications(prev => prev.filter(item => item.id !== id));
                        fetchStudentNotifications({ page: 1 }, filterStudentStatus);
                    }
                } catch (error: any) {

                }
            }
        })

    }

    const handleDeletePost = async (id: number) => {
        Swal.fire({
            title: 'Bạn chắc chắn xóa thông báo này!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vâng, hãy xóa!"
        }).then(async (results) => {
            if (results.isConfirmed) {
                try {
                    const response = await deletePost(id);
                    if (response.status === HttpStatus.SUCCESS) {
                        Swal.fire({
                            title: 'Xóa thông báo thành công',
                            icon: 'success',
                        });
                        setNotifications(prev => prev.filter(item => item.id !== id));
                        fetchMyNotifications({ page: 1 }, filterStatus);
                    }
                } catch (error: any) {

                }
            }
        })


    }

    const handleEdit = (post: NotificationCourseSection) => {
        setEditingPost(post);
        setIsOpenEditModal(true);
    }

    const handleStudentNotificationEdit = (notification: StudentNotification) => {
        setEditStudentNotification(notification);
        setIsOpenStudentNotificationModal(true);
    }

    useEffect(() => {
        const handler = setTimeout(() => {
            setKeywordPostDebounce(keywordPost);
            setPage(1);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [keywordPost]);

    useEffect(() => {
        fetchMyNotifications({ key: keywordPostDebounce, page: page }, filterStatus);
    }, [keywordPostDebounce, filterStatus, page]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setKeywordNotificationDebounce(keywordNotification);

        }, 300);

        return () => {
            clearTimeout(handler);
        };

    }, [keywordNotification]);

    useEffect(() => {
        fetchStudentNotifications({ key: keywordNotificationDebounce }, filterStudentStatus);
    }, [keywordNotificationDebounce, filterStudentStatus]);

    return (
        <>
            <PageHeader title='🔔 Thông Báo' subtitle='Quản lý thông báo của giảng viên' />
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
                                        value={keywordPost}
                                        onChange={(e) => setKeywordPost(e.target.value)}

                                    />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                                </div>
                                <select
                                    className="filter-select"
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="public">Công khai</option>
                                    <option value="private">Không công khai</option>
                                </select>
                            </div>
                        </div>

                        {/* Notifications List */}
                        {loading ? (<Loading />) : notifications.length === 0 ? <div className="notification-no-item"> Không có thông báo nào</div> : notifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <NotificationItem notification={notification} onDelete={() => handleDeletePost(notification.id)} onEdit={() => handleEdit(notification)} />
                            </div>
                        ))}

                        {/* Pagination */}
                        {notifications.length === 0 ? <> </> : paginate ? (<div className="pagination">
                            <div className="pagination-info">
                                Hiển thị <strong> {paginate?.from}</strong> đến <strong> {paginate?.to}</strong> trong tổng số <strong>{paginate?.total}</strong> thông báo
                            </div>
                            <div className="pagination-controls">
                                <button className="page-btn" onClick={() => setPage(paginate?.previous_page)}>Trước</button>
                                <button className="page-btn active">{paginate?.current_page}</button>
                                <button className="page-btn" onClick={() => setPage(paginate?.next_page)}>Sau</button>
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
                                        value={keywordNotification}
                                        onChange={(e) => setKeywordNotification(e.target.value)}
                                    />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                                </div>
                                <select
                                    className="filter-select"
                                    value={filterStudentStatus}
                                    onChange={(e) => setFilterStudentStatus(e.target.value)}
                                >
                                    <option value="">Tất cả trạng thái</option>
                                    <option value="read">Đã đọc</option>
                                    <option value="unread">Chưa đọc</option>
                                </select>

                            </div>
                        </div>

                        {/* Notifications List */}
                        {loadingStudentNotify ? (<Loading />) : studentNotifications.length === 0 ? <div className="notification-no-item">Không có thông báo nào</div> : studentNotifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <StudentNotificationItem notification={notification} onDelete={() => handleDeleteNotification(notification.id)} onEdit={() => { handleStudentNotificationEdit(notification) }} />
                            </div>
                        ))}

                        {/* Pagination */}
                        {
                            studentNotifications.length === 0 ? <> </> : <div className="pagination">
                                <div className="pagination-info">
                                    Hiển thị <strong> {studentNotifyPaginate?.from}</strong> đến <strong> {studentNotifyPaginate?.to}</strong> trong tổng số <strong>{studentNotifyPaginate?.total}</strong> thông báo
                                </div>
                                <div className="pagination-controls">
                                    <button className="page-btn" onClick={() => fetchStudentNotifications({ page: studentNotifyPaginate?.previous_page }, filterStudentStatus)}>Trước</button>
                                    <button className="page-btn active"> {studentNotifyPaginate?.current_page} </button>
                                    <button className="page-btn" onClick={() => fetchStudentNotifications({ page: studentNotifyPaginate?.next_page }, filterStudentStatus)}>Sau</button>
                                </div>
                            </div>
                        }

                    </TabPanel>
                </Tabs>
            </div >
            {isOpenCreateModal ? <CreateNotificationModal isOpen={isOpenCreateModal} onClose={() => { setIsOpenCreateModal(false) }} onSuccessTeacher={() => { fetchMyNotifications({ page: 1 }, filterStatus) }} onSuccessStudent={() => fetchStudentNotifications({ page: 1 }, filterStudentStatus)} /> : <> </>
            }

            {
                isOpenEditModal ? <EditNotificationModal isOpen={isOpenEditModal} onClose={() => { setIsOpenEditModal(false) }} notification={editingPost} onSuccess={(updatePost) => { setNotifications(prev => prev.map((post) => post.id === updatePost.id ? updatePost : post)) }} /> : <> </>
            }
            {
                isOpenStudentNotificationModal ? <EditStudentNotificationModal isOpen={isOpenStudentNotificationModal} onClose={() => { setIsOpenStudentNotificationModal(false) }} onSuccess={(updateNotification) => setStudentNotifications(prev => prev.map((notification) => notification.id === updateNotification.id ? updateNotification : notification))} onReload={() => { fetchStudentNotifications({ page: 1 }, filterStudentStatus) }} notification={editStudentNotification} /> : <> </>
            }
        </>
    )
}
export default Notification;