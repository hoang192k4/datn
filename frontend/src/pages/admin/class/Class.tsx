import { useEffect, useState } from "react";
import PageHeader from "../../../components/ui/PageHeader"
import './Class.css';
import ClassCard from "./ClassCard";
import { detachStudentByCourseSection, getCourseSectionByTeacher, getListStudentByCourseSection } from "../../../services/courseSectionService";
import type { CourseSection } from "../../../types/courseSecion";
import type { StudentList } from "../../../types/student";
import SelectWithPagination from "../../../components/ui/SelectWithPagination";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { normalizeString } from "../../../utils/searchUtil";
import { statusMap } from "../../../utils/studentText";
import ClassStudentDetail from "./ClassStudentDetail";
import { FaDeleteLeft } from "react-icons/fa6";
import Swal from "sweetalert2";
import SelectWithPaginationStudent from "../../../components/ui/SelectWithPaginationStudent";
import { genderMap } from "../../../utils/genderMap";
import { Loading } from "../../../components/ui/Loading";

const Class = () => {
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState<'default' | 'student_list'>('default');
    const [listCourseSection, setListCourseSection] = useState<CourseSection[]>([]);
    const [currentClassId, setCurrentClassId] = useState<number | null>(null);
    const [studentList, setStudentList] = useState<StudentList[]>([]);
    const [studentDetail, setStudentDetail] = useState<StudentList>();
    const [currentClassName, setCurrentClassName] = useState<string>('');
    const [keyword, setKeyword] = useState<string>('');
    const [showPopup, setShowPopup] = useState<'show' | 'hide'>('hide');
    const [showPopupAddStudent, setShowPopupAddStudent] = useState<'show' | 'hide'>('hide');
    const [selectedYear, setSelectedYear] = useState<string>('');
    const [selectedSemester, setSelectedSemester] = useState<string>('');

    const hanldeSelected = (selected: { value: number, lable: string, data: any }) => {
        if (selected.data) {
            setShowPopupAddStudent('show');
            setStudentDetail(selected.data);
        }
    }

    const handleSelection = (classId: { label: string, value: number }) => {
        setCurrentClassId(classId.value);
        setCurrentClassName(classId.label);
    }

    const fetchCourseSection = async () => {
        try {
            setLoading(true);
            const res = await getCourseSectionByTeacher('');
            setListCourseSection(res.data.data.course_sections);
        } catch (errors) {
            console.log(errors);
        } finally { setLoading(false); }
    }


    useEffect(() => {
        fetchCourseSection();
    }, [])

    const yearOptions = Array.from(
        new Set(
            listCourseSection.map(item =>
                new Date(item.start_date).getFullYear()
            )
        )
    ).sort((yearA, yearB) => yearB - yearA);

    const semesterOptions = Array.from(
        new Map(
            listCourseSection.map(item => [item.semester.id, item.semester])
        ).values()
    ).sort((a, b) => a.id - b.id)
        .map(sem => ({
            label: `${sem.name}  ( ${sem.start_year} - ${sem.end_year} )`,
            value: sem.id,
        }));

    const filterCourseSection = listCourseSection && listCourseSection.filter((courseSection) => {
        const yearMatch = selectedYear === '' || new Date(courseSection.start_date).getFullYear() === parseInt(selectedYear);
        const semesterMatch = selectedSemester === '' || courseSection.semester.id === Number(selectedSemester);
        return yearMatch && semesterMatch;
    })

    const fetchStudentList = async (courseSectionId: number) => {
        try {
            setLoading(true);
            const res = await getListStudentByCourseSection(courseSectionId);
            if (res)
                setStudentList(res.data);
        } catch (errors) {
            console.log(errors);
        } finally { setLoading(false); }
    }



    const handleStudentDetail = async (studentId: number) => {
        const student = studentList.filter(student => student.id === studentId)
        if (student) {
            setStudentDetail(student[0]);
            setShowPopup('show');
        }
    }

    const handleDeleteStudent = (studentId: number) => {
        Swal.fire({
            title: "Bạn có thật sự muốn xóa sinh viên này ra khỏi lớp?",
            showCancelButton: true,
            icon: "question",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                if (currentClassId) {
                    const res = await detachStudentByCourseSection(studentId, currentClassId);
                    Swal.fire({
                        title: res.message,
                        icon: "success",
                        draggable: true
                    });
                    setStudentList((prev) => prev.filter(student => student.id !== studentId));
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
        }).finally(() => setLoading(false));
    }

    useEffect(() => {
        if (currentClassId)
            fetchStudentList(currentClassId)
    }, [currentClassId])

    return (
        <>
            <PageHeader title="📚 Quản lý lớp học" subtitle="Hệ thống quản lý lớp học, danh sách sinh viên" />
            <div className="class-container box-container">
                {action === 'default' ?
                    <>
                        <div className="list-course-section">
                            <h2>Danh sách lớp học</h2>
                            <div>
                                <select className="select-filter reposive-select-mb" onChange={(e: any) => setSelectedSemester(e.target.value)} value={selectedSemester}>
                                    <option value="">--Lọc theo học kỳ--</option>
                                    {semesterOptions.map(semester => (
                                        <option key={semester.value} value={semester.value}>{semester.label}</option>
                                    ))}
                                </select>
                                <select className="select-filter reposive-select-mb" onChange={(e: any) => setSelectedYear(e.target.value)} value={selectedYear}>
                                    <option value="">--Lọc theo năm--</option>
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        {loading ? <Loading /> :
                            <div className="grid class-scroll">
                                {
                                    filterCourseSection.length > 0 ?
                                        filterCourseSection?.map(item => (
                                            <ClassCard key={item.id} course_section={item} setAction={setAction}
                                                setCurrentClassId={setCurrentClassId} setCurrentClassName={setCurrentClassName} />
                                        )) :
                                        <div style={{ textAlign: 'center', color: '#888', marginTop: '1.5rem' }}>
                                            <strong>Không có lớp học nào phù hợp với tiêu chí đã chọn.</strong>
                                        </div>
                                }
                            </div>
                        }
                    </> :
                    action === 'student_list' &&
                    <>
                        <div className="class-students-header">
                            <div className="students-top">
                                <span onClick={() => setAction('default')}><IoMdArrowRoundBack /></span>
                                <div className="box-header">
                                    <h2 style={{ color: "#2e3b8c" }}>Danh Sách Sinh Viên Lớp {currentClassName && currentClassName}</h2>
                                </div>
                            </div>
                            <div className="students-bottom">
                                <div className="students-bottom-left">
                                    <div className="class-search-student">
                                        <input type="text" placeholder="Tìm kiếm sinh viên..." onChange={(e) => setKeyword(e.target.value)} />
                                        <FaSearch />
                                    </div>

                                    <div className="gm-class-select class-search">
                                        <SelectWithPagination handleClassSelection={handleSelection} />
                                    </div>
                                </div>
                                <div className="class-add-student">
                                    <SelectWithPaginationStudent hanldeSelected={hanldeSelected} />
                                </div>
                            </div>
                        </div>
                        {loading ? <Loading /> :
                            <div className="class-student-main">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>STT</th>
                                            <th>MSSV</th>
                                            <th>Họ và Tên</th>
                                            <th>Email</th>
                                            <th>Giới Tính</th>
                                            <th>Tình trạng</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {studentList && studentList.length > 1 ? studentList.filter(item => item.student_code.toLowerCase().includes(keyword) ||
                                            normalizeString(item.name).includes(normalizeString(keyword)))
                                            .map((student, index) => (
                                                <tr key={student.id} onClick={() => handleStudentDetail(student.id)}>
                                                    <td>{index + 1}</td>
                                                    <td>{student.student_code}</td>
                                                    <td>{student.name}</td>
                                                    <td>{student.email}</td>
                                                    <td>{genderMap[student.gender]}</td>
                                                    <td>{statusMap[student.status]}</td>
                                                    <td><div onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student.id) }}><FaDeleteLeft /><button>Xóa</button></div></td>
                                                </tr>
                                            )) :
                                            <tr><td colSpan={7} style={{ textAlign: 'center' }}>Không có sinh viên nào</td></tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        }
                    </>
                }
            </div>
            {showPopupAddStudent === 'show' && <ClassStudentDetail student={studentDetail}
                setShowPopupAddStudent={setShowPopupAddStudent} showBtnAddStudent={true}
                currentClassId={currentClassId} fetchStudentList={fetchStudentList} />}

            {showPopup === 'show' && <ClassStudentDetail currentClassId={currentClassId}
                student={studentDetail} setShowPopup={setShowPopup} showBtnAddStudent={false} />}
        </>
    )
}

export default Class