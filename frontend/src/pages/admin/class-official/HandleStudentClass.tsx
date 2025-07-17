import { useEffect, useMemo, useRef, useState, type SetStateAction } from "react";
import type React from "react";
import { getAllStudents } from "../../../services/studentService";
import type { Meta } from "../../../types/teacher";
import Selecto from "react-selecto";
import { StudentStatus } from "../../../enums/StudentStatus";
import debounce from "lodash.debounce";
import { Loading } from "../../../components/ui/Loading";

interface PropsClassPopup {
    setOpen: React.Dispatch<SetStateAction<boolean>>;
    setSelectedStudentId: React.Dispatch<SetStateAction<number[]>>;
    selectedStudentId: number[];
}
interface Student {
    id: number,
    name: string,
    student_code: string,
    class_name: string,
}
const HandleStudentclass: React.FC<PropsClassPopup> = ({ setOpen, setSelectedStudentId, selectedStudentId }: PropsClassPopup) => {
    const [loadingStudent, setLoadingStudent] = useState(false);
    const [listStudent, setListStudent] = useState<Student[]>([]);
    const [meta, setMeta] = useState<Meta>();
    const containerRef = useRef<HTMLDivElement>(null);
    const [keyword, setKeyword] = useState<string>('');
    const selectoRef = useRef<any>(null);

    const fetchListStudent = async (key: string = '', page: number = 1) => {
        try {
            setLoadingStudent(true);
            const res = await getAllStudents(key, page, StudentStatus.Active);
            setMeta(res.data.meta);
            setListStudent(res.data.students);
        } catch (errors) {

        } finally { setLoadingStudent(false); }
    }

    useEffect(() => {
        fetchListStudent();
    }, [])

    const handleSelectedStudentId = (studentid: number, checked: boolean) => {
        setSelectedStudentId((prev) => {
            if (checked) {
                // Nếu chọn thì thêm vào danh sách (nếu chưa có)
                if (!prev.includes(studentid)) {
                    // Thêm class selecto-selected cho phần tử tương ứng
                    const el = document.querySelector(`.popup-add-student-item[data-id='${studentid}']`);
                    if (el) el.classList.add('selecto-selected');
                    return [...prev, studentid];
                }
                return prev;
            } else {
                const el = document.querySelector(`.popup-add-student-item[data-id='${studentid}']`);
                if (el) el.classList.remove('selecto-selected');
                return prev.filter(id => id !== studentid);
            }
        });
    };

    const handleSelect = (e: any) => {
        const selectedElements = e.selected;
        selectedElements.forEach((el: HTMLElement) => {
            el.classList.add('selecto-selected');
        });
        const ids = selectedElements.map((el: HTMLElement) => Number(el.dataset.id));
        setSelectedStudentId((prev) => Array.from(new Set([...prev, ...ids])));
        selectoRef.current?.setSelectedTargets(e.selected);
    };

    const handleFilterKey = useMemo(() => debounce((keyword: string) => {
        fetchListStudent(keyword);
    }, 500), [])

    return (
        <div className="popup-add-student-backdrop" onClick={(e) => e.stopPropagation()}>
            <div className="popup-add-student-dialog">
                <header>
                    <h2>Chọn Sinh Viên Thêm Vào Lớp</h2>
                    <button className="popup-add-student-close-btn" onClick={() => setOpen(false)}>✖</button>
                </header>
                <input type="text" className="popup-add-student-search-input" placeholder="Tìm kiếm tên, MSSV..." onChange={(e) => { handleFilterKey(e.target.value); setKeyword(e.target.value) }} />
                {loadingStudent ? <Loading /> :
                    <>
                        <div className="popup-add-student-list" ref={containerRef}>
                            {listStudent.map((student, index) => (
                                <div className="popup-add-student-item" key={student.id} data-id={student.id}>
                                    <div className="popup-add-student-info">
                                        <p>{meta && meta?.from + index} | {student.name} ({student.student_code})</p>
                                       {/*  <small>Lớp: CDTH23</small> */}
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudentId.includes(student.id)}
                                        onChange={(e) => handleSelectedStudentId(student.id, e.target.checked)}
                                    />
                                </div>
                            ))}
                        </div>


                        <Selecto
                            ref={selectoRef}
                            container={containerRef.current}
                            dragContainer={containerRef.current}
                            selectableTargets={[".popup-add-student-item"]}
                            selectByClick={false}
                            hitRate={0}
                            selectFromInside={true}
                            toggleContinueSelect={["shift"]}
                            onSelectEnd={handleSelect}
                        />

                        <div className="pagination-container-admin">
                            <div className="pagination-controls">
                                <button className="page-btn page-disabled" onClick={() => meta?.previous_page != null &&
                                    fetchListStudent(keyword, meta?.previous_page)
                                } disabled={!meta?.previous_page}>
                                    Trang trước
                                </button>
                                <button className="page-btn active">{meta?.current_page}</button>
                                <button className="page-btn page-disabled" onClick={() => meta?.next_page != null &&
                                    fetchListStudent(keyword, meta?.next_page)} disabled={!meta?.next_page}>
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    </>}
                <div className="popup-add-student-actions">
                    <button className="popup-add-student-btn popup-add-student-btn-close" onClick={() => { setOpen(false); setSelectedStudentId([]) }}>Đóng</button>
                    <button className="popup-add-student-btn popup-add-student-btn-confirm" onClick={() => setOpen(false)}>Xác Nhận ({selectedStudentId.length}) sinh viên</button>
                </div>
            </div>

        </div>
    );
}

export default HandleStudentclass