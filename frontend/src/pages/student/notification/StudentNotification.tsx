; import React, { useEffect, useMemo, useState } from 'react';
import './Notification.css'; // Import your CSS styles
import PageHeader from '../../../components/ui/PageHeader';
import { Tabs, TabList, TabPanel, Tab } from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import 'react-tabs/style/react-tabs.css';
import { deleteNotification, getFeedbackSendFromStudent, getNotifications } from '../../../services/notificationService';
import type { Paginate } from '../../../types/paginate';
import { HttpStatus } from '../../../enums/HttpStatus';
import { Loading } from '../../../components/ui/Loading';

import Swal from 'sweetalert2';

import { NotificationType } from '../../../enums/NotificationType';
import NotificationItem from './NotificationItem';
import NotificationModal from './CreateNotificationModal';
import type { TeacherList } from '../../../types/teacher';
import TeacherNotificationItem from './TeacherNotificationItem';
import debounce from 'lodash.debounce';

interface Notification {
    id: number;
    title: string;
    content: string;
    created_at: string;
    sender: string;
    status: string;
    from: string
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

interface Feedback {
    id: number,
    title: string,
    content: string,
    created_at: string,
    sender: string,
    from: string,
    status: string,
    teacher: TeacherList
}

const StudentNotification: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [studentNotifications, setStudentNotifications] = useState<StudentNotification[]>([]);
    const [studentNotifyPaginate, setStudentNotifyPaginate] = useState<Paginate>();
    const [paginate, setPaginate] = useState<Paginate>();
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingStudentNotify, setLoadingStudentNotify] = useState<boolean>(false)

    // const [editingPost, setEditingPost] = useState<NotificationCourseSection>();
    const [keyword, setKeyword] = useState<string>('');
    const [keywordDebounce, setKeywordDebounce] = useState<string>('');
    const [keywordNotification, setKeywordNotification] = useState<string>('');
    const [keywordNotificationDebounce, setKeywordNotificationDebounce] = useState<string>('');
    const [page, setPage] = useState<number | null | undefined>(1);
    const [studentPage, setStudentPage] = useState<number | null | undefined>(1);
    const [createModal, setCreateModal] = useState(false);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [feedbackPaginate, setFeedbackPaginate] = useState<Paginate>();
    const [search, setSearch] = useState<string>('');
    const [feedbackPage, setFeedbackPage] = useState<number | null | undefined>(1);
    const [searchInput, setSearchInput] = useState<string>('');

    const fetchNotifications = async ({ page, limit, key }: Paginate, type: NotificationType | null) => {
        try {
            setLoading(true);
            const response = await getNotifications({ page, limit, key }, type);

            if (response.status === HttpStatus.SUCCESS) {
                const notifications = response.data.notifications;
                const paginate = response.data.meta;
                setNotifications(notifications);
                setPaginate(paginate);
            }
        } catch (error: any) {

        } finally {
            setLoading(false);
        }
    }
    const fetchStudentNotifications = async ({ page, limit, key }: Paginate, type: NotificationType | null) => {
        try {
            setLoadingStudentNotify(true);
            const response = await getNotifications({ page, limit, key }, type);
            if (response.status === HttpStatus.SUCCESS) {
                const notifications = response.data.notifications;
                const paginate = response.data.meta;
                setStudentNotifications(notifications);
                setStudentNotifyPaginate(paginate);
            }


        } catch (error: any) {

        } finally {
            setLoadingStudentNotify(false);
        }
    }

    const fetchFeedbacks = async (key: string | null, page: number | null) => {
        try {
            setLoadingStudentNotify(true);
            const response = await getFeedbackSendFromStudent(key, page);
            if (response.status === HttpStatus.SUCCESS) {
                const notifications = response.data.notifications;
                const paginate = response.data.meta;
                setFeedbacks(notifications);
                setFeedbackPaginate(paginate);
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
                        fetchStudentNotifications({ page: 1 }, NotificationType.StudentSend);
                        fetchNotifications({ page: 1 }, NotificationType.AdminSend);
                        fetchFeedbacks(search, feedbackPage ?? 1);

                    }
                } catch (error: any) {

                }
            }
        })

    }


    useEffect(() => {
        const handler = setTimeout(() => {
            setKeywordDebounce(keyword);
            setPage(1);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [keyword]);

    useEffect(() => {
        fetchNotifications({ key: keywordDebounce, page: page }, NotificationType.AdminSend);
    }, [keywordDebounce, NotificationType.AdminSend, page]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setKeywordNotificationDebounce(keywordNotification);
            setStudentPage(1);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [keywordNotification]);

    useEffect(() => {
        fetchStudentNotifications({ key: keywordNotificationDebounce, page: studentPage }, NotificationType.TeacherSend);
    }, [keywordNotificationDebounce, studentPage]);



    useEffect(() => {
        fetchFeedbacks(search, feedbackPage ?? 1);
    }, [search, feedbackPage]);


    const handler = useMemo(() => debounce((search) => {
        setSearch(search);
    }, 500), []);

    useEffect(() => {
        handler(searchInput);
    }, [searchInput])
    return (
        <>
            <PageHeader title='Thông Báo' subtitle='Quản lý thông báo của sinh viên' />
            <div className="notification-container">
                {/* Header */}
                <div className="header">
                    <div className="header-left">
                        <svg className="header-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5-5-5h5V12h5v5z" />
                        </svg>
                        <h1 className="header-title">Thông Báo Từ Khoa Và Giảng Viên</h1>

                    </div>
                    <button className="btn-primary" onClick={() => setCreateModal(true)}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Gửi phản hồi đến giảng viên
                    </button>
                </div>
                <Tabs>
                    <TabList>
                        <Tab>Thông báo từ khoa</Tab>
                        <Tab>Thông báo từ giảng viên</Tab>
                        <Tab>Phản hồi đã gửi</Tab>
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
                                        value={keyword}
                                        onChange={(e) => setKeyword(e.target.value)}

                                    />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                                </div>

                            </div>
                        </div>

                        {/* Notifications List */}
                        {loading ? (<Loading />) : notifications.length === 0 ? <div className="notification-no-item"> Không có thông báo nào</div> : notifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <NotificationItem notification={notification} onDelete={() => handleDeleteNotification(notification.id)} />
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
                            </div>
                        </div>

                        {/* Notifications List */}
                        {loadingStudentNotify ? (<Loading />) : studentNotifications.length === 0 ? <div className="notification-no-item">Không có thông báo nào</div> : studentNotifications.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <NotificationItem notification={notification} onDelete={() => handleDeleteNotification(notification.id)} />
                            </div>
                        ))}

                        {/* Pagination */}
                        {
                            studentNotifications.length === 0 ? <> </> : <div className="pagination">
                                <div className="pagination-info">
                                    Hiển thị <strong> {studentNotifyPaginate?.from}</strong> đến <strong> {studentNotifyPaginate?.to}</strong> trong tổng số <strong>{studentNotifyPaginate?.total}</strong> thông báo
                                </div>
                                <div className="pagination-controls">
                                    <button className="page-btn" onClick={() => setStudentPage(studentNotifyPaginate?.previous_page)}>Trước</button>
                                    <button className="page-btn active"> {studentNotifyPaginate?.current_page} </button>
                                    <button className="page-btn" onClick={() => setStudentPage(studentNotifyPaginate?.next_page)}>Sau</button>
                                </div>
                            </div>
                        }

                    </TabPanel>
                    {/* phản hồi đã gửi */}
                    <TabPanel>
                        {/* Filters */}
                        <div className="filters">
                            <div className="filters-row">
                                <div className="search-container">
                                    <input
                                        type="text"
                                        className="search-input"
                                        placeholder="Tìm kiếm..."
                                        value={searchInput}
                                        onChange={(e) => { setSearchInput(e.target.value) }}
                                    />
                                    <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
                                </div>


                            </div>
                        </div>

                        {/* Notifications List */}
                        {loadingStudentNotify ? (<Loading />) : feedbacks.length === 0 ? <div className="notification-no-item">Không có thông báo nào</div> : feedbacks.map((notification) => (
                            <div key={notification.id} className="notification-item">
                                <TeacherNotificationItem notification={notification} onDelete={() => handleDeleteNotification(notification.id)} onEdit={() => { }} />
                            </div>
                        ))}

                        {/* Pagination */}
                        {
                            feedbacks.length === 0 ? <> </> : <div className="pagination">
                                <div className="pagination-info">
                                    Hiển thị <strong> {feedbackPaginate?.from}</strong> đến <strong> {feedbackPaginate?.to}</strong> trong tổng số <strong>{feedbackPaginate?.total}</strong> thông báo
                                </div>
                                <div className="pagination-controls">
                                    <button className="page-btn" onClick={() => setFeedbackPage(feedbackPaginate?.previous_page)}>Trước</button>
                                    <button className="page-btn active"> {feedbackPaginate?.current_page} </button>
                                    <button className="page-btn" onClick={() => setFeedbackPage(feedbackPaginate?.next_page)}>Sau</button>
                                </div>
                            </div>
                        }

                    </TabPanel>
                </Tabs>
            </div >

            <NotificationModal isOpen={createModal} onClose={() => { setCreateModal(false) }} onSuccess={() => fetchFeedbacks(search, feedbackPage ?? 1)} />

            {/* {
                isOpenEditModal ? <EditNotificationModal isOpen={isOpenEditModal} onClose={() => { setIsOpenEditModal(false) }} notification={editingPost} onSuccess={() => { fetchMyNotifications({ page: 1 }, filterStatus) }} /> : <> </>
            }
            {
                isOpenStudentNotificationModal ? <EditStudentNotificationModal isOpen={isOpenStudentNotificationModal} onClose={() => { setIsOpenStudentNotificationModal(false) }} onSuccess={() => fetchStudentNotifications({}, filterStudentStatus)} notification={editStudentNotification} /> : <> </>
            } */}
        </>


    )
}
export default StudentNotification;