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
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterType, setFilterType] = useState<string>('all');
    const [paginate, setPaginate] = useState<Paginate>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStudentNotify, setLoadingStudentNotify] = useState<boolean>(false)
    const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);
    const [isOpenEditModal, setIsOpenEditModal] = useState<boolean>(false);
    const [editingPost, setEditingPost] = useState<NotificationCourseSection>();

    useEffect(() => {
        fetchMyNotifications({ page: 1, limit: 10 });
        fetchStudentNotifications({});
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

    const fetchStudentNotifications = async ({ page, limit }: Paginate) => {
        try {
            setLoadingStudentNotify(true);
            const response = await getStudentNotifications({ page, limit });
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
                        {loading ? (<Loading />) : notifications.length === 0 ? <div className="notification-no-item"> Không có thông báo nào</div> : notifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <NotificationItem notification={notification} onDelete={() => handleDeletePost(notification.id)} onEdit={() => handleEdit(notification)}/>
                            </div>
                        ))}

                        {/* Pagination */}
                        {notifications.length === 0 ? <> </> : paginate ? (<div className="pagination">
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
                        {loadingStudentNotify ? (<Loading />) : studentNotifications.length === 0 ? <div className="notification-no-item">Không có thông báo nào</div> : studentNotifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <StudentNotificationItem notification={notification} onDelete={() => handleDeleteNotification(notification.id)} onEdit={() => { }} />
                            </div>
                        ))}

                        {/* Pagination */}
                        {
                            studentNotifications.length === 0 ? <> </> : <div className="pagination">
                                <div className="pagination-info">
                                    Hiển thị <strong> {studentNotifyPaginate?.from}</strong> đến <strong> {studentNotifyPaginate?.to}</strong> trong tổng số <strong>{studentNotifyPaginate?.total}</strong> thông báo
                                </div>
                                <div className="pagination-controls">
                                    <button className="page-btn" onClick={() => fetchStudentNotifications({ page: studentNotifyPaginate?.previous_page })}>Trước</button>
                                    <button className="page-btn active"> {studentNotifyPaginate?.current_page} </button>
                                    <button className="page-btn" onClick={() => fetchStudentNotifications({ page: studentNotifyPaginate?.next_page })}>Sau</button>
                                </div>
                            </div>
                        }

                    </TabPanel>
                </Tabs>
            </div >
            {isOpenCreateModal ? <CreateNotificationModal isOpen={isOpenCreateModal} onClose={() => { setIsOpenCreateModal(false) }} onSuccessTeacher={() => { fetchMyNotifications({ page: 1 }) }} onSuccessStudent={() => fetchStudentNotifications({ page: 1 })} /> : <> </>
            }

            {
                isOpenEditModal ? <EditNotificationModal isOpen={isOpenEditModal} onClose={() => { setIsOpenEditModal(false) }} notification={editingPost} onSuccess={() => { fetchMyNotifications({ page: 1 }) }} /> : <> </>
            }
        </>
    )
}

export default Notification;