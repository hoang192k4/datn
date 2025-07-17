import { useEffect, useMemo, useState } from "react"
import PageHeader from "../../../components/ui/PageHeader"
import { getListClassesFilter, updateStatusClass } from "../../../services/classServices";
import { CourseSectionStatus } from "../../../enums/CourseSectionStatus";
import { type Classes } from "../../../types/classes";
import { HttpStatus } from "../../../enums/HttpStatus";
import type { Meta } from "../../../types/teacher";
import { Loading } from "../../../components/ui/Loading";
import debounce from "lodash.debounce";
import { FaEdit, FaSearch } from "react-icons/fa";
import { CourseSectionStatusMap } from "../../../utils/courseSectionText";
import ClassOfficialPopup from "./ClassOfficialPopup";
import './Class-official.css';
import Swal from "sweetalert2";

const ClassOfficial = () => {
    const [loading, setLoading] = useState(false);
    const [listClasses, setListClasses] = useState<Classes[]>([]);
    const [actionClass, setActionClass] = useState<'create' | 'update' | ''>('');
    const [meta, setMeta] = useState<Meta>();
    const [keyword, setKeyword] = useState<string>('');
    const [openId, setOpenId] = useState<number | null>(null);
    const [detailClass, setDetailClass] = useState<any>();
    const [selectedStatus, setSelectedStatus] = useState<CourseSectionStatus | null>(null);


    const toggleDropdown = (id: number) => {
        setOpenId(prev => prev === id ? null : id);
    };
    const fetchListClass = async (key: string = '', page: number = 1, status: CourseSectionStatus | null = null) => {
        try {
            setLoading(true);
            const res = await getListClassesFilter(key, page, status);
            if (res.status === HttpStatus.SUCCESS) {
                setListClasses(res.data.classes);
                setMeta(res.data.meta);
            }
        } catch (errors) {

        } finally { setLoading(false) }
    }



    useEffect(() => {
        fetchListClass();
    }, [])

    const statusOptions = [
        { value: 'in_register', label: 'Mở Đăng Ký' },
        { value: 'in_progress', label: 'Đang Diễn Ra' },
        { value: 'completed', label: 'Kết Thúc' },
    ];

    const handleSelectedStatus = (status: CourseSectionStatus | null) => {
        fetchListClass(keyword, 1, status);
    }

    const hanldeFilterKey = useMemo(() => debounce((key: string, selectedStatus: CourseSectionStatus | null) => {
        fetchListClass(key, 1, selectedStatus);
    }, 500), []);

    const handleUpdateStatus = async (status: CourseSectionStatus, classId: number) => {
        Swal.fire({
            title: `Thay đổi trạng thái lớp học phần thành <span style="color: #1e3a8a;">${CourseSectionStatusMap[status as CourseSectionStatus]}</span>?`,
            showCancelButton: true,
            icon: "question",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setOpenId(null);
                const res = await updateStatusClass(status, classId);
                if (res) {
                    console.log(res);
                    Swal.fire({
                        title: res.message,
                        icon: "success",
                        draggable: true
                    });
                    setListClasses(prev => prev.map(item => (
                        item.id === classId ? {
                            ...item,
                            status: item.status = status
                        } : item
                    )));
                }
            }
        }).catch((errors) => {
            if (errors)
                console.log(errors);

            if (errors.response.status === HttpStatus.BAD_REQUEST) {
                Swal.fire({
                    title: "Thực hiện không thành công!",
                    icon: "warning",
                    text: errors.response.data.errors[0],
                    draggable: true
                });
                return;
            }
            Swal.fire({
                title: "Hệ thống đang có vấn đề. Vui lòng thử lại!",
                icon: "error",
                draggable: true
            });
        })
    }

    const handleShowPopupUpdate = (classId: number) => {
        const data = listClasses.filter(item => item.id === classId);
        setDetailClass(data[0]);
        setActionClass('update');
    }

    return (
        <>
            <PageHeader title="🎓 Quản lý lớp chính khóa" subtitle="Hệ thống quản lý lớp chính khóa" />

            <div className="box-container">
                <div className="box-header">
                    <h2>Danh sách lớp chính khóa</h2>

                    <div>
                        <button className="btn-attendance" onClick={() => setActionClass('create')}>Thêm lớp chính khóa</button>
                    </div>
                </div>
                <div className="box-header">
                    <div className="class-search-student">
                        <input type="text" placeholder="Tìm kiếm lớp chính khóa..." onChange={(e) => {
                            setKeyword(e.target.value);
                            hanldeFilterKey(e.target.value, selectedStatus);
                        }} />
                        <FaSearch />
                    </div>
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

                {loading ? <Loading /> :
                    <div className="course-section-list">
                        <table className="class-official-table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Tên lớp</th>
                                    <th>Giảng viên chủ nhiệm</th>
                                    <th>Thời gian bắt đầu</th>
                                    <th>Thời gian kết thúc</th>
                                    <th>Số lượng sinh viên</th>
                                    <th>Trạng thái</th>
                                    <th>Thao tác</th>
                                </tr>
                            </thead>

                            <tbody>
                                {listClasses && listClasses.length > 0 ?
                                    listClasses.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{meta && meta?.from + index}</td>
                                            <td>{item.name}</td>
                                            <td>{item.teacher_name}</td>
                                            <td>{item.start_time}</td>
                                            <td>{item.end_time}</td>
                                            <td>{item.studentsId.length}</td>
                                            <td>
                                                <div className="status-dropdown-wrapper" >
                                                    <span onClick={() => toggleDropdown(item.id)}
                                                        className={`status-badge course-section-${item.status}`}>
                                                        {CourseSectionStatusMap[item.status]}
                                                    </span>
                                                    {openId === item.id && (
                                                        <div className="status-dropdown">
                                                            {statusOptions.map(opt => (
                                                                <div
                                                                    key={opt.value}
                                                                    className="status-dropdown-item"
                                                                    onClick={() => handleUpdateStatus(opt.value as CourseSectionStatus, item.id)}
                                                                >
                                                                    {opt.label}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td>  <button className="btn-admin edit-btn-admin" onClick={() => handleShowPopupUpdate(item.id)}><FaEdit /></button></td>
                                        </tr>
                                    ))
                                    :
                                    <tr><td colSpan={8} style={{ textAlign: 'center' }}>Không có lớp học nào phù hợp</td></tr>}
                            </tbody>
                        </table>
                        <div className="pagination-container-admin">
                            <div className="pagination-controls">
                                <button className="page-btn page-disabled" onClick={() => meta?.previous_page != null &&
                                    fetchListClass(keyword, meta?.previous_page, selectedStatus)
                                } disabled={!meta?.previous_page}>
                                    Trang trước
                                </button>
                                <button className="page-btn active">{meta?.current_page}</button>
                                <button className="page-btn page-disabled" onClick={() => meta?.next_page != null &&
                                    fetchListClass(keyword, meta?.next_page, selectedStatus)} disabled={!meta?.next_page}>
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    </div>
                }

                {actionClass && <ClassOfficialPopup actionClass={actionClass}
                    setActionClass={setActionClass} fetchListClass={fetchListClass}
                    detailClass={detailClass} />}
            </div>
        </>
    )
}

export default ClassOfficial