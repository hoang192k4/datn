import React, { useEffect, useMemo, useState } from 'react';
import './ScheduleManagement.css'
import PageHeader from '../../../components/ui/PageHeader';
import type { Schedule } from '../../../types/schedule';
import { createSchedule, getSchedules, updateSchdedule } from '../../../services/scheduleService';
import { HttpStatus } from '../../../enums/HttpStatus';
import type { Paginate } from '../../../types/paginate';
import debounce from 'lodash.debounce';
import { Loading } from '../../../components/ui/Loading';
import ScheduleModal from './ScheduleModal';
import Swal from 'sweetalert2';
import SelectWithPaginationClassroom from '../../../components/ui/SelectWithPaginationClassroom';
import { Loading as CreateLoading } from '../../../components/ui/loading/Loading'

import { FaEdit, FaTrash } from "react-icons/fa";

type ScheduleFormData = {
    id?: number;
    course_section: { value: number | null, label: string | null };
    day_of_week: string;
    period_start: number | null;
    period_number: number | null;
    classroom: { value: number | null, label: string | null };
};

const ScheduleManagement: React.FC = () => {

    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [inputSearch, setInputSearch] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterDay, setFilterDay] = useState<string>("");
    const [filterSession, setFilterSession] = useState<string>("");
    const [paginate, setPaginate] = useState<Paginate>();
    const [page, setPage] = useState<number>(1);
    const [filterSemester, setFilterSemester] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [scheduleModal, setScheduleModal] = useState(false);
    const [filterClassroom, setFilterClassroom] = useState<{ value: number | null, label: string | null }>({ value: null, label: null });
    const [loadingCreate, setLoadingCreate] = useState(false);
    const [scheduleSelected, setSchdeuleSelected] = useState<ScheduleFormData | null>(null);
    const [typeModal, setTypeModal] = useState<"create" | "update">("create");

    const sessionMap = {
        morning: "Sáng",
        afternoon: "Chiều"
    }
    const daysOfWeek = [{ value: 0, label: "Chủ nhật" }, { value: 1, label: "Thứ 2" }, { value: 2, label: "Thứ 3" }, { value: 3, label: "Thứ 4" }, { value: 4, label: "Thứ 5" }, { value: 5, label: "Thứ 6" }, { value: 6, label: "Thứ 7" }];
    const sessions = [
        { value: 'morning', label: 'Sáng' },
        { value: 'afternoon', label: 'Chiều' },
        // { value: 'evening', label: 'Tối' }
    ];

    const semesters = [
        { value: 1, label: "Học kỳ 1" },
        { value: 2, label: "Học kỳ 2" },
        { value: 3, label: "Học kỳ 3" },
        { value: 4, label: "Học kỳ 4" },
        { value: 5, label: "Học kỳ 5" },
        { value: 6, label: "Học kỳ 6" },
    ]

    const fetchSchedules = async (key: any, session: any, daysOfWeek: any, page: any, semester: any, classroomId: any) => {
        try {
            setLoading(true);
            const response = await getSchedules(key, session, daysOfWeek, page, semester, classroomId);
            if (response.status === HttpStatus.SUCCESS) {
                const schedules = response.data.schedules;
                const paginate = response.data.meta;
                setSchedules(schedules);
                setPaginate(paginate);
            }

        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    const fetchScheduleNoLoading = async (key: any, session: any, daysOfWeek: any, page: any, semester: any, classroomId: any) => {
        try {
            const response = await getSchedules(key, session, daysOfWeek, page, semester, classroomId);
            if (response.status === HttpStatus.SUCCESS) {
                const schedules = response.data.schedules;
                const paginate = response.data.meta;
                setSchedules(schedules);
                setPaginate(paginate);
            }

        } catch (error) {

        } finally {
        }
    }

    const handleSearch = useMemo(() => debounce((value: string) => {
        setSearchTerm(value);
    }, 500), []);

    useEffect(() => {
        return () => {
            handleSearch.cancel(); // tránh memory leak
        };
    }, [handleSearch]);

    useEffect(() => {
        fetchSchedules(searchTerm, filterSession, filterDay, page, filterSemester, filterClassroom?.value);
    }, [page, filterDay, filterSession, searchTerm, filterSemester, filterClassroom]);

    const handleSubmit = async (data: ScheduleFormData) => {
        if (typeModal === "create") {
            try {
                setLoadingCreate(true);
                const response = await createSchedule(data);
                if (response.status === HttpStatus.SUCCESS) {

                    Swal.fire({
                        title: 'Thêm lịch mới thành công!',
                        icon: "success"
                    })

                    fetchScheduleNoLoading(searchTerm, filterSession, filterDay, page, filterSemester, filterClassroom.value);
                }
            } catch (error: any) {
                console.log(error);
                if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
                    const errors = error.response.data.errors.period_start;
                    console.log(errors);
                    const lis = errors.map((e: any) => `<li>${e}</li>`).join('');
                    Swal.fire({
                        title: 'Thêm lịch không thành công!',
                        icon: "warning",
                        html: `<ul> ${lis}</ul>`
                    })
                }

                if (error.response.status === HttpStatus.BAD_REQUEST) {
                    const errors = error.response.data.message_validate;
                    console.log(errors);
                    const allMessages = Object.values(errors).flat();
                    const lis = allMessages.map((message) => `<li> ${message}</li>`).join('');
                    Swal.fire({
                        title: 'Thêm lịch không thành công!',
                        icon: "warning",
                        html: `<ul> ${lis}</ul>`
                    })
                }
            } finally {
                setLoadingCreate(false);
            }
        }

        if (typeModal === "update") {
            try {
                setLoadingCreate(true);
                const response = await updateSchdedule(data);
                if (response.status === HttpStatus.SUCCESS) {
                    Swal.fire({
                        title: 'Cập nhật lịch thành công!',
                        icon: "success"
                    })
                    fetchScheduleNoLoading(searchTerm, filterSession, filterDay, page, filterSemester, filterClassroom?.value);
                }
            } catch (error: any) {
                if (error.response.status === HttpStatus.UNPROCESSABLE_ENTITY) {
                    const errors = error.response.data.errors;
                    const allMessages = Object.values(errors).flat();
                    const lis = allMessages.map((message) => `<li> ${message}</li>`).join('');
                    Swal.fire({
                        title: 'Cập nhật lịch không thành công!',
                        icon: "warning",
                        html: `<ul> ${lis}</ul>`
                    })
                }

                if (error.response.status === HttpStatus.BAD_REQUEST) {
                    const errors = error.response.data.message_validate;

                    const allMessages = Object.values(errors).flat();
                    const lis = allMessages.map((message) => `<li> ${message}</li>`).join('');
                    Swal.fire({
                        title: 'Cập nhật lịch không thành công!',
                        icon: "warning",
                        html: `<ul> ${lis}</ul>`
                    })
                }
            } finally {
                setLoadingCreate(false);
                setSchdeuleSelected(null);
            }
        }

    }

    const handleEdit = (data: ScheduleFormData) => {
        setSchdeuleSelected(data);
        setTypeModal("update");
        setScheduleModal(true);
    }

    return (
        <>
            {loadingCreate ? <CreateLoading title="Đang thêm lịch mới" /> : <> </>}
            <PageHeader title="📅 Quản lý thời khóa biểu" subtitle="Quản lý lịch học của các lớp trong trường" />
            <div className="schedule-container">
                <div className="schedule-wrapper">
                    {/* Header */}
                    <div className="schedule-header">
                        <div>
                            <h1 className="schedule-title"> Thời khóa biểu</h1>
                        </div>
                        <button
                            className="add-button"
                            onClick={() => { setSchdeuleSelected(null); setScheduleModal(true); setTypeModal("create") }}
                        >
                            ➕ Thêm lịch học
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="filters-container">
                        <div className="filters-grid">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm theo lớp, môn học, giáo viên..."
                                    value={inputSearch}
                                    onChange={(e) => { handleSearch(e.target.value); setInputSearch(e.target.value) }}
                                    className="search-input"
                                />
                            </div>
                            <select
                                value={filterSemester}
                                onChange={(e) => { setFilterSemester(e.target.value); setPage(1) }}
                                className="select-field"
                                style={{ maxWidth: '200px', marginLeft: '20%' }}
                            >
                                <option value="">Tất cả các kì</option>
                                {semesters.map((semester, index) => (
                                    <option key={index} value={semester.value}>{semester.label}</option>
                                ))}
                            </select>

                            <SelectWithPaginationClassroom value={filterClassroom} onChange={(selected) => setFilterClassroom(selected)} />
                            <select
                                value={filterDay}
                                onChange={(e) => { setFilterDay(e.target.value); setPage(1) }}
                                className="select-field"
                            >
                                <option value="">Tất cả các ngày</option>
                                {daysOfWeek.map((day, index) => (
                                    <option key={index} value={day.value}>{day.label}</option>
                                ))}
                            </select>
                            <select
                                value={filterSession}
                                onChange={(e) => { setFilterSession(e.target.value); setPage(1) }}
                                className="select-field"
                            >
                                <option value="">Tất cả buổi học</option>
                                {sessions.map(session => (
                                    <option key={session.value} value={session.value}>{session.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    {/* Schedule Table */}
                    <div className="table-container">
                        <div className="table-wrapper">
                            <table className="schedule-table">
                                <thead className="table-head">
                                    <tr>
                                        <th className="table-header">Lớp</th>
                                        <th className="table-header">Môn học</th>
                                        <th className="table-header">Thứ</th>
                                        <th className="table-header">Số tiết</th>
                                        <th className="table-header">Thời gian</th>
                                        <th className="table-header">Buổi</th>
                                        <th className="table-header">Phòng</th>
                                        <th className="table-header">Giáo viên</th>
                                        <th className="table-header">Học kỳ</th>
                                        <th className="table-header" colSpan={2}>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr> <td colSpan={10}><Loading /> </td></tr> : (
                                        schedules.map((schedule) => (
                                            <tr key={schedule.id} className="table-row">
                                                <td className="table-cell">
                                                    <span className="badge-class">{schedule.course_section.name}</span>
                                                </td>
                                                <td className="table-cell">{schedule.course_section.subject}</td>
                                                <td className="table-cell">
                                                    <span className="badge-day">
                                                        {daysOfWeek[schedule.day_of_week].label}
                                                    </span>
                                                </td>
                                                <td className="table-cell">
                                                    <span className="badge-period">{schedule.period_number}</span>
                                                </td>
                                                <td className="table-cell">
                                                    {schedule.start_time} - {schedule.end_time}
                                                </td>
                                                <td className="table-cell">
                                                    <span className="badge-session">
                                                        {sessionMap[schedule.session]}
                                                    </span>
                                                </td>
                                                <td className="table-cell">{schedule.classroom.name}</td>
                                                <td className="table-cell">{schedule.course_section.teacher}</td>
                                                <td className="table-cell">{schedule.course_section.semester}</td>
                                                <td className="table-cell">
                                                    <div className="action-buttons">
                                                        <button
                                                            onClick={() => handleEdit({
                                                                course_section: {
                                                                    value: schedule.course_section.id ?? null,
                                                                    label: schedule.course_section.name ?? null
                                                                },
                                                                day_of_week: schedule.day_of_week?.toString() ?? "",
                                                                period_start: schedule.period_start ?? null,
                                                                period_number: schedule.period_number ?? null,
                                                                classroom: {
                                                                    value: schedule.classroom?.id ?? null,
                                                                    label: schedule.classroom?.name ?? null
                                                                },
                                                                id: schedule.id
                                                            })}
                                                            className="schedule-edit-button student-btn-primary"
                                                        >
                                                            <FaEdit />
                                                        </button>

                                                    </div>
                                                </td>
                                                <td className="table-cell">
                                                    <div className="action-buttons">
                                                        <button
                                                            className="schedule-delete-button student-btn-primary   "
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}

                                </tbody>
                            </table>
                        </div>
                        {!loading ? (
                            schedules.length !== 0 && (
                                <div className="student-pagination-container">
                                    <div className="student- pagination">
                                        <button className="student-pagination-btn student-pagination-prev" onClick={() => setPage(paginate?.previous_page ?? 1)}>‹</button>
                                        <button className="student-pagination-btn active"> {paginate?.current_page}</button>
                                        <button className="student-pagination-btn student-pagination-next" onClick={() => setPage(paginate?.next_page ?? 1)}> ›</button>
                                    </div>
                                </div>)) : <></>}

                        {schedules.length === 0 && (
                            <div className="empty-state">
                                <h3 className="empty-title">Không có lịch học</h3>
                                <p className="empty-text">
                                    {searchTerm || filterDay || filterSession ?
                                        "Không tìm thấy lịch học phù hợp với bộ lọc" :
                                        "Bắt đầu bằng cách thêm lịch học mới"}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Statistics
                    <div className="stats-grid">
                        <div className="stat-card">
                            <div className="stat-icon">📅</div>
                            <div>
                                <p className="stat-label">Tổng lịch học</p>
                                <p className="stat-value">{schedules.length}</p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div>
                                <p className="stat-label">Số lớp</p>
                                <p className="stat-value">
                                    {new Set(schedules.map(s => s.classroom.name)).size}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📚</div>
                            <div>
                                <p className="stat-label">Số môn học</p>
                                <p className="stat-value">
                                    {new Set(schedules.map(s => s.course_section.subject)).size}
                                </p>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">⏰</div>
                            <div>
                                <p className="stat-label">Tổng số tiết</p>
                                <p className="stat-value">
                                    {schedules.reduce((sum, s) => sum + s.period_number, 0)}
                                </p>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div >
            <ScheduleModal isOpen={scheduleModal} onClose={() => { setScheduleModal(false); setSchdeuleSelected(null) }} onSubmit={handleSubmit} defaultValues={scheduleSelected ?? undefined} />
        </>
    );
};

export default ScheduleManagement;