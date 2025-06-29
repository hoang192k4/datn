import { useEffect, useMemo, useState } from "react"
import PageHeader from "../../../components/ui/PageHeader"
import type { CourseSection } from "../../../types/courseSecion"
import type { CourseSectionStatus } from "../../../enums/CourseSectionStatus";
import type { Meta } from "../../../types/teacher";
import { getCourseSectionFilter, updateCourseSectionStatus } from "../../../services/courseSectionService";
import Loadding from "../../../components/ui/Loadding";
import { formatDayMonthYear } from "../../../utils/stringUtil";
import { getSemesters } from "../../../services/semesterService";
import type { SemesterList } from "../../../types/semester";
import { FaEdit, FaSearch } from "react-icons/fa";
import { CourseSectionStatusMap } from "../../../utils/courseSectionText";
import debounce from "lodash.debounce";
import './CourseSection.css';
import Swal from "sweetalert2";
import CourseSectionPopupAction from "./CourseSectionPopupAction";

const CourseSectionManager = () => {
    const [courseSectionlist, setCourseSectionList] = useState<CourseSection[]>([]);
    const [tmpCourseSectionlist, setTmpCourseSectionList] = useState<CourseSection[]>([]);
    const [loadingCourseSection, setLoadingCourseSection] = useState(false);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [yearOption, setYearOption] = useState<number[]>([]);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [keyword, setKeyword] = useState<string | null>(null);
    const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<CourseSectionStatus | null>(null);
    const [semesterList, setSemesterList] = useState<SemesterList[]>([]);
    const [openId, setOpenId] = useState<number | null>(null);
    const [selectedCourseSecton, setSelectedCourseSection] = useState<CourseSection | null>(null);
    const [actionCourseSection, setActionCourseSection] = useState<'create' | 'update' | ''>('');

    const toggleDropdown = (id: number) => {
        setOpenId(prev => prev === id ? null : id);
    };
    const fetchCourseSectionList = async (keyword: string | null = null,
        year: string | null = null,
        page = 1,
        status: CourseSectionStatus | null = null,
        semesterId: string | null = null) => {
        try {
            setLoadingCourseSection(true);
            const res = await getCourseSectionFilter(keyword, year, page, status, semesterId);
            setCourseSectionList(res.data.course_sections);
            setMeta(res.data.meta);
            if (!tmpCourseSectionlist.length) {
                setTmpCourseSectionList(res.data.course_sections);
            }
        } catch (errors) {
            console.log(errors);
        } finally { setLoadingCourseSection(false); }
    }

    const fetchSemesterList = async () => {
        const res = await getSemesters();
        setSemesterList(res.data);
    }

    const fetchYearOption = () => {
        const yearArray = Array.from(
            new Set(
                tmpCourseSectionlist.map(item =>
                    new Date(item.start_date).getFullYear()
                )
            )
        ).sort((yearA, yearB) => yearB - yearA);
        setYearOption(yearArray);
    }


    useEffect(() => {
        fetchCourseSectionList();
        fetchSemesterList();
    }, [])

    useEffect(() => {
        if (tmpCourseSectionlist.length) {
            fetchYearOption();
        }
    }, [tmpCourseSectionlist]);

    const handleSelectedStatus = (selectedStatus: CourseSectionStatus | null) => {
        fetchCourseSectionList(keyword, selectedYear, 1, selectedStatus, selectedSemester);
    }

    const hanldeSelectedSemester = (selectedSemester: string | null) => {
        fetchCourseSectionList(keyword, selectedYear, 1, selectedStatus, selectedSemester);
    }

    const hanldeSelectedYear = (selectedYear: string | null) => {
        fetchCourseSectionList(keyword, selectedYear, 1, selectedStatus, selectedSemester);
    }
    const hanldeFilterKey = useMemo(() => debounce((key: string, selectedStatus: CourseSectionStatus | null,
        selectedSemester: string | null, selectedYear: string | null) => {
        fetchCourseSectionList(key, selectedYear, 1, selectedStatus, selectedSemester);
    }, 500), []);

    const statusOptions = [
        { value: 'in_register', label: 'Mở Đăng Ký' },
        { value: 'in_progress', label: 'Đang Diễn Ra' },
        { value: 'completed', label: 'Kết Thúc' },
    ];
    const handleUpdateStatus = (newStatus: CourseSectionStatus, courseSectionId: number) => {
        Swal.fire({
            title: `Thay đổi trạng thái lớp học phần thành <span style="color: #1e3a8a;">${CourseSectionStatusMap[newStatus as CourseSectionStatus]}</span>?`,
            showCancelButton: true,
            icon: "question",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingCourseSection(true)
                setOpenId(null);
                const res = await updateCourseSectionStatus(courseSectionId, newStatus);
                if (res) {
                    console.log(res);
                    Swal.fire({
                        title: res.message,
                        icon: "success",
                        draggable: true
                    });
                    setCourseSectionList(prev => prev.map(item => (
                        item.id === courseSectionId ? {
                            ...item,
                            status: item.status = newStatus
                        } : item
                    )));
                }
            }
        }).catch((errors) => {
            if (errors)
                console.log(errors);
            Swal.fire({
                title: "Hệ thống đang có vấn đề. Vui lòng thử lại!",
                icon: "error",
                draggable: true
            });
        }).finally(() => setLoadingCourseSection(false));

    };

    const handleShowPopupUpdate = (courseSectionId: number) => {
        setActionCourseSection('update');
        const data = courseSectionlist.filter(item => item.id === courseSectionId);
        setSelectedCourseSection(data[0]);
    }


    return (
        <>
            {loadingCourseSection && <Loadding />}
            <PageHeader title="Quản lý lớp học phân" subtitle="Hệ thống quản lý lớp học phần" />
            <div className="box-container">
                <div className="course-section-header">
                    <div className="box-header">
                        <h2>Danh sách lớp học phần</h2>
                        <div>
                            <button className="btn-attendance" onClick={() => { setActionCourseSection('create'); setSelectedCourseSection(null) }}>Thêm Lớp Học Phần</button>
                        </div>
                    </div>

                    <div className="box-header">
                        <div className="class-search-student">
                            <input type="text" placeholder="Tìm kiếm lớp học phần..." onChange={(e) => {
                                setKeyword(e.target.value);
                                hanldeFilterKey(e.target.value, selectedStatus, selectedSemester, selectedYear);
                            }} />
                            <FaSearch />
                        </div>
                        <div>
                            <select className="select-filter reposive-select-mb" onChange={(e) => {
                                const value = e.target.value;
                                setSelectedYear(value ? value : null);
                                hanldeSelectedYear(value ? value : null);
                            }} >
                                <option value="">--Tất Cả Các Năm--</option>
                                {
                                    yearOption.length > 1 && yearOption.map(item => (
                                        <option key={item} value={item}>Năm {item}</option>
                                    ))
                                }

                            </select>
                            <select className="select-filter reposive-select-mb" onChange={(e) => {
                                const value = e.target.value;
                                setSelectedSemester(value ? value : null);
                                hanldeSelectedSemester(value ? value : null);
                            }} >
                                <option value="">--Tất Cả Học Kỳ--</option>
                                {semesterList && semesterList.map(semester => (
                                    <option key={semester.id} value={semester.id}>{semester.name}</option>
                                ))}

                            </select>
                            <select className="select-filter reposive-select-mb" onChange={(e) => {
                                const value = e.target.value;
                                setSelectedStatus(value ? value as CourseSectionStatus : null);
                                handleSelectedStatus(value ? value as CourseSectionStatus : null);
                            }} >
                                <option value="">--Tất Cả--</option>
                                {statusOptions && statusOptions.map(item => (
                                    <option key={item.value} value={item.value}>{item.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="course-section-list">
                    <table className="course-section-table">
                        <thead>
                            <tr>
                                <th>Lớp Học</th>
                                <th>Giảng Viên Phụ Trách</th>
                                <th>Bắt Đầu</th>
                                <th>Kết Thúc</th>
                                <th>Số Tuần</th>
                                <th>Lớp Chủ Quản</th>
                                <th>Môn Học</th>
                                <th>Học Kỳ</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {courseSectionlist && courseSectionlist.length > 0 ? courseSectionlist.map((courseSection) => (
                                <tr key={courseSection.id}>
                                    <td>{courseSection.name} <br /> <small>Tổng sinh viên: {courseSection.students_total}</small></td>
                                    <td>{courseSection.teacher || <small>Chưa cập nhật</small>}</td>
                                    <td>{formatDayMonthYear(courseSection.start_date)}</td>
                                    <td>{courseSection.end_date ? formatDayMonthYear(courseSection.end_date) : '-'}</td>
                                    <td>{courseSection.week_total}</td>
                                    <td>{courseSection.class || <small>Chưa cập nhật</small>}</td>
                                    <td>{courseSection.subject || <small>Chưa cập nhật</small>}</td>
                                    <td>{courseSection.semester || <small>Chưa cập nhật</small>}</td>
                                    <td>
                                        <div className="status-dropdown-wrapper" >
                                            <span onClick={() => toggleDropdown(courseSection.id)}
                                                className={`status-badge course-section-${courseSection.status}`}>
                                                {CourseSectionStatusMap[courseSection.status]}
                                            </span>
                                            {openId === courseSection.id && (
                                                <div className="status-dropdown">
                                                    {statusOptions.map(opt => (
                                                        <div
                                                            key={opt.value}
                                                            className="status-dropdown-item"
                                                            onClick={() => handleUpdateStatus(opt.value as CourseSectionStatus, courseSection.id)}
                                                        >
                                                            {opt.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button className="btn-admin edit-btn-dmin" onClick={() => handleShowPopupUpdate(courseSection.id)}><FaEdit /></button>
                                    </td>
                                </tr>
                            )) : <tr><td colSpan={10}>Không có lớp học phù hợp theo tiêu chí đã chọn</td></tr>}
                        </tbody>
                    </table>
                    <div className="pagination-container-admin">
                        <div className="pagination-controls">
                            <button className="page-btn" onClick={() => meta?.previous_page != null &&
                                fetchCourseSectionList(keyword, selectedYear, meta?.previous_page, selectedStatus, selectedSemester)
                            } disabled={!meta?.previous_page}>
                                Trang trước
                            </button>
                            <button className="page-btn active">{meta?.current_page}</button>
                            <button className="page-btn" onClick={() => meta?.next_page != null &&
                                fetchCourseSectionList(keyword, selectedYear, meta?.next_page, selectedStatus, selectedSemester)} disabled={!meta?.next_page}>
                                Trang sau
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {
                actionCourseSection && <CourseSectionPopupAction setActionCourseSection={setActionCourseSection}
                    semesterList={semesterList} setLoadingCourseSection={setLoadingCourseSection}
                    fetchCourseSectionList={fetchCourseSectionList} actionCourseSection={actionCourseSection}
                    selectedCourseSection={selectedCourseSecton} />
            }
        </>
    )
}

export default CourseSectionManager