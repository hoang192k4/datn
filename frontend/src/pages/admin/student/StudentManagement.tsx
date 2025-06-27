import { useEffect, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader";
import StudentItem from "./StudentItem";
import './StudentManagement.css'
import type { StudentList } from "../../../types/student";
import { createStudent, exportStudentsExcel, getAllStudents, importExelStudent, updateStudent } from "../../../services/studentService";
import { HttpStatus } from "../../../enums/HttpStatus";
import type { Paginate } from "../../../types/paginate";
import Swal from "sweetalert2";
import { StudentLoading } from "./StudentLoading";
import { StudentStatus } from "../../../enums/StudentStatus";
import { statusMap } from "../../../utils/studentText";
import { toast, ToastContainer } from "react-toastify";
import StudentModal from "./StdentModal";
import type { Major } from "../../../types/major";
import { getMajors } from "../../../services/majorService";
import { FaCloudUploadAlt } from "react-icons/fa";
import ImportStudentModal from "./ImportStudentModal";
import { Trophy } from "lucide-react";



const StudentManagement = () => {

    const [students, setStudents] = useState<StudentList[]>([]);
    const [paginate, setPagiante] = useState<Paginate>();
    const [keyWord, setKeyWord] = useState<string>('');
    const [keyWordDebounce, setKeyWordDebounce] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [gotoPage, setGotoPage] = useState<number>(1);
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<StudentList | null>(null);
    const [majors, setMajors] = useState<Major[]>();
    const [statusModal, setStatusModal] = useState<"create" | "update">("update");
    const [importModal, setImportModal] = useState<boolean>(false);

    const fetchStudents = async (key: string, page: number, filter: string) => {
        try {
            setLoading(true);
            const response = await getAllStudents(key, page, filter);
            if (response.status === HttpStatus.SUCCESS) {
                const students = response.data.students;
                const meta = response.data.meta;
                setStudents(students);
                setPagiante(meta);
            }
        } catch (error: any) {
            if (error.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                Swal.fire({
                    title: "Có lỗi trong quá trình lấy dữ liệu",
                    icon: "error",
                });
            }
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchMajors();
    }, []);
    useEffect(() => {
        fetchStudents(keyWordDebounce, page, filterStatus);
    }, [page, keyWordDebounce, filterStatus]);

    const fetchMajors = async () => {
        try {
            const response = await getMajors();
            if (response.status === HttpStatus.SUCCESS) {
                const majors = response.data;
                setMajors(majors);
            }
        } catch {

        }
    }
    useEffect(() => {
        const handler = setTimeout(() => {
            setKeyWordDebounce(keyWord);
            setPage(1);
        }, 300);
        return () => clearTimeout(handler);
    }, [keyWord]);


    const generatePageNumbers = (currentPage: number, totalPages: number, delta: number = 2): (number | string)[] => {
        const pages: (number | string)[] = [];

        let start = Math.max(1, currentPage - delta);
        let end = Math.min(totalPages, currentPage + delta);

        if (start > 1) {
            pages.push(1);
            if (start > 2) pages.push("...");
        }

        for (let i = start; i <= end; i++) {
            pages.push(i);
        }

        if (end < totalPages) {
            if (end < totalPages - 1) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    const statusOptions = Object.entries(StudentStatus).map(([key, value]) => ({
        label: statusMap[value],
        value: value
    }));


    const handleExportExcel = async (status: string | null) => {
        try {
            const response = await exportStudentsExcel(status);
            const disposition = response.headers['content-disposition'];
            const match = disposition && disposition.match(/filename="?(.+)"?/);
            const filename = match ? match[1] : 'export.xlsx';

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            Swal.fire({
                title: "Xuất file danh sách sinh viên thành công",
                icon: 'success'
            })
        } catch (error) {
            toast.warning('Lỗi khi xuất danh sách sinh viên');
        }
    }

    const handleEditStudent = (student: StudentList) => {
        setSelectedStudent(student);
        setModalOpen(true);
    };

    const handleCreateStudent = () => {
        setSelectedStudent(null);
        setModalOpen(true);
        setStatusModal("create");
    }

    const handleSubmit = async (student: any) => {
        if (statusModal === "update") {
            try {
                const response = await updateStudent(student);
                if (response.status === HttpStatus.SUCCESS) {
                    Swal.fire({
                        title: "Cập nhật thông tin thành công!",
                        icon: "success",
                    })
                    fetchStudents(keyWordDebounce, page, filterStatus);
                }
            } catch (error: any) {
                if (error.response.status === HttpStatus.BAD_REQUEST) {
                    const messageValidate: any[] = error.response.data.message_validate;
                    console.log(messageValidate);
                    const html = Object.values(messageValidate)
                        .flat() // lấy tất cả lỗi con trong từng trường
                        .map((msg: string) => `<p>${msg}</p>`)
                        .join('');
                    Swal.fire({
                        title: "Cập nhật thông tin thất bại",
                        html: html,
                        icon: "error",
                    })
                }
            }
        }

        if (statusModal === "create") {
            try {
                console.log(student);
                const response = await createStudent(student);
                if (response.status === HttpStatus.SUCCESS) {
                    Swal.fire({
                        title: "Cập nhật thông tin thành công!",
                        icon: "success",
                    })
                    fetchStudents(keyWordDebounce, page, filterStatus);
                }
            } catch (error: any) {
                if (error.response.status === HttpStatus.BAD_REQUEST) {
                    const messageValidate: any[] = error.response.data.message_validate;
                    console.log(messageValidate);
                    const html = Object.values(messageValidate)
                        .flat() // lấy tất cả lỗi con trong từng trường
                        .map((msg: string) => `<p>${msg}</p>`)
                        .join('');
                    Swal.fire({
                        title: "Cập nhật thông tin thất bại",
                        html: html,
                        icon: "error",
                    })
                }
            }
        }
    }

    const handleUpload = async (file: File) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await importExelStudent(formData);
            if (response.status === HttpStatus.SUCCESS) {
                Swal.fire({
                    title: 'Thêm sinh viên với excel thành công!',
                    icon: 'success',
                });
            }
        } catch (error: any) {

        }
    }
    return (
        <>
            <ToastContainer />
            <PageHeader title="Quản lí sinh viên" subtitle="Hệ thống quản lí sinh viên" />
            <div className="gm-grade-section">

                <div className="gm-grade-header">
                    <div className="gm-selected-class-info">
                        <div className="gm-class-details">
                            <h3>Danh Sách Sinh Viên</h3>
                            <p> sinh viên</p>
                        </div>
                    </div>

                    <div className="gm-grade-actions">
                        <button className="btn-primary" onClick={handleCreateStudent}>Thêm sinh viên</button>
                    </div>
                </div>
                <div className="gm-grade-controls">
                    {/* Left side - Import/Export buttons */}
                    <div className="left-actions">
                        <button className="btn-import" onClick={() => setImportModal(true)}>
                            <FaCloudUploadAlt />
                            Import
                        </button>

                        <button className="btn-export">
                            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            Export
                        </button>
                    </div>

                    {/* Right side - Search and Status Filter */}
                    <div className="right-actions">
                        {/* Status Select */}
                        <div className="status-select-container">
                            <select className="status-select" onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}>
                                <option value="">Tất cả trạng thái</option>
                                {
                                    statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))

                                }
                            </select>
                            <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Search Input */}
                        <div className="search-container">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                className="search-input"
                                placeholder="Tìm kiếm sinh viên..."
                                onChange={(e) => { setKeyWord(e.target.value.trim()) }}
                            />
                        </div>
                    </div>
                </div>

                <div id="attendance-form" className="gm-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th> #</th>
                                <th>Mã sinh viên</th>
                                <th>Email</th>
                                <th>Họ tên</th>
                                <th>Ngày sinh</th>
                                <th>Địa chỉ</th>
                                <th>Giới tính</th>
                                <th>Thời gian nhập học</th>
                                <th>Thời gian tốt nghiệp</th>
                                <th>Ngành học</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <StudentLoading /> : (
                                students.length > 0 ? (
                                    students.map((student, index) => (
                                        <tr key={student.id}>
                                            <StudentItem index={paginate?.from ? paginate.from + index : index} student={student} onEdit={handleEditStudent} setTypeModal={() => setStatusModal("update")} />
                                        </tr>
                                    ))
                                ) : (<tr style={{ width: "100%", textAlign: 'center', gridColumn: 1 / -1 }} ><td colSpan={12} style={{ textAlign: 'center' }}> Không tìm thấy sinh viên</td></tr>)
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="pagination-container">
                    <div className="pagination-info">
                        Hiển thị từ <strong>{paginate?.from}</strong> đến <strong>{paginate?.to}</strong> trong tổng số <strong>{paginate?.total}</strong> sinh viên
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                        <div className="pagination-controls">
                            <button className="pagination-btn arrow" onClick={() => { setPage(1) }} id="firstBtn">
                                ≪
                            </button>
                            <button className="pagination-btn arrow" onClick={() => { setPage(paginate?.previous_page ?? 1) }} id="prevBtn">
                                ‹
                            </button>

                            {generatePageNumbers(paginate?.current_page ?? 1, paginate?.total_pages ?? 1).map((page, index) => {
                                if (page === "...") {
                                    return (
                                        <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span>
                                    );
                                }

                                return (
                                    <button
                                        key={page}
                                        className={`pagination-btn ${page === paginate?.current_page ? "active" : ""}`}
                                        onClick={() => setPage(Number(page))}
                                    >
                                        {page}
                                    </button>
                                );
                            })}

                            <button className="pagination-btn arrow" onClick={() => { setPage(paginate?.next_page ?? 1) }} id="nextBtn">
                                ›
                            </button>
                            <button className="pagination-btn arrow" onClick={() => { setPage(paginate?.total_pages ?? 1) }} id="lastBtn">
                                ≫
                            </button>
                        </div>

                        <div className="page-input-container">
                            <span style={{ color: "white", fontSize: " 13px" }}>Trang:</span>
                            <input
                                type="number"
                                className="page-input"
                                placeholder="1"
                                min="1"
                                max="50"
                                id="pageInput"
                                value={gotoPage}
                                onChange={e => setGotoPage(Number(e.target.value))}
                            />
                            <button className="go-btn" onClick={() => { setPage(gotoPage) }}>Đi</button>
                        </div>
                    </div>
                </div>

            </div>

            {<StudentModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={(data) => { handleSubmit(data); setModalOpen(false) }} initialData={selectedStudent} majors={majors} />}

            <ImportStudentModal isOpen={importModal} onClose={() => setImportModal(false)} onImport={handleUpload} />
        </>
    )
}

export default StudentManagement;