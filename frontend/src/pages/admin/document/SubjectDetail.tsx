import { useEffect, useState } from "react";
import "./Document.css";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
    createChapter, createLecture, deleteChapter, deleteLecture, getDetailDocumentBySubjectId,
    getListSubjectKeyword, updateChapter, updateLecture
} from "../../../services/docmentSubjectService";
import Loadding from "../../../components/ui/Loadding";
import type { ChapterInstance, DocumentSubject, Lecture } from "../../../types/documentSubject";
import { MdDelete, MdSaveAs } from "react-icons/md";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaEdit } from "react-icons/fa";
import { HttpStatus } from "../../../enums/HttpStatus";


const SubjectDetail = () => {
    const { id, } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const slugTeacher = location.pathname.split('/')[1];
    const url = `/${slugTeacher}/tai-lieu/tai-lieu-chi-tiet`;
    const [loadingGetDocumentDetail, setLoadingGetDocumentDetail] = useState(false);
    const [showChapterPopup, setShowChapterPopup] = useState(false);
    const [showLecturePopup, setShowLecturePopup] = useState(false);
    const [dataDocument, setDataDocument] = useState<DocumentSubject | null>(null);
    const [formAction, setFormAction] = useState<'create' | 'update'>('create');
    const [showListSubjectSearch, setShowListSubjectSearch] = useState(false);
    const [query, setQuery] = useState<any | String>('');
    const [listSubject, setListSubject] = useState<any[]>([]);
    const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);
    const { register, handleSubmit, formState: { errors, dirtyFields }, reset, getValues } = useForm<ChapterInstance>();
    const { register: regiterLecture, handleSubmit: handleSubmitLecture, formState: { errors: lectureErrors, dirtyFields: dirtyFieldsLecture }, reset: resetLecture, getValues: getValuesLecture } = useForm<Lecture>();

    const getDocumentDetail = async () => {
        try {
            setLoadingGetDocumentDetail(true);
            const documentDetail = await getDetailDocumentBySubjectId(Number(id));
            setDataDocument(documentDetail.data);
        } catch (errors: any) {
            if (errors.status === HttpStatus.FORBIDDEN)
                navigate('/403');
        } finally { setLoadingGetDocumentDetail(false) }
    }
    const getListSubject = async () => {
        const res = await getListSubjectKeyword();
        setListSubject(res.data);
    }
    useEffect(() => {
        getDocumentDetail();
        getListSubject();
    }, [id]);


    const filterSubjects = (keyword: string) => {
        const result = listSubject.filter((subject) =>
            subject.subject_name.toLowerCase().includes(keyword.toLowerCase())
        );
        setFilteredSubjects(result);
    };

    useEffect(() => {
        if (listSubject.length > 0) {
            filterSubjects(query);
        }
    }, [query, listSubject]);

    const handleAddChapter = async (chapter: ChapterInstance) => {
        try {
            setLoadingGetDocumentDetail(true);
            const res = await createChapter(Number(id), chapter.title, chapter.position);
            if (res) {
                getDocumentDetail();
                reset();
                setShowChapterPopup(false);
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message_validate.title ? errors.response.data.message_validate.title
                    : errors.response.data.message_validate.position ? errors.response.data.message_validate.position : errors.response.data.message,
                icon: "error",
                draggable: true
            });
        } finally { setLoadingGetDocumentDetail(false); }
    };

    const handleShowPopupCreateChapter = () => {
        setShowChapterPopup(true);
        reset({ title: '' });
        setFormAction('create');
    }

    const hanldeShowPopupUpdateDeleteChapter = (id: number) => {
        const data = dataDocument?.chapters.find((chapter) => chapter.id === id);
        if (data) {
            setFormAction('update');
            setShowChapterPopup(true);
            reset(data);
        }
    }

    const hanldeUpdateChapter = async (chapter: ChapterInstance) => {
        const allValues = getValues();
        const updateValues: Partial<ChapterInstance> = {}
        for (const key in dirtyFields) {
            (updateValues as any)[key as keyof ChapterInstance] = allValues[key as keyof ChapterInstance];
        }
        if (Object.keys(updateValues).length === 0) {
            Swal.fire({
                title: "Không có nội dung nào được thay đổi để cập nhật!",
                icon: "warning"
            });
            return;
        }
        try {
            setLoadingGetDocumentDetail(true);
            const res = await updateChapter(Number(id), chapter.id, updateValues);
            if (res) {
                setShowChapterPopup(false);
                getDocumentDetail();
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message_validate.title ? errors.response.data.message_validate.title
                    : errors.response.data.message_validate.position ? errors.response.data.message_validate.position : errors.response.data.message,
                icon: "error",
                draggable: true
            });
        } finally { setLoadingGetDocumentDetail(false); }

    }

    const handleDeleteChapter = (chapter: ChapterInstance) => {
        Swal.fire({
            title: "Bạn có thật sự muốn xóa Chương này?",
            text: "Xóa chương này đồng nghĩa với việc toàn bộ bài giảng trong chương cũng sẽ bị xóa!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingGetDocumentDetail(true);
                const res = await deleteChapter(chapter.id);
                if (res) {
                    setShowChapterPopup(false);
                    getDocumentDetail();
                    Swal.fire({
                        title: res.data.message,
                        icon: "success",
                        draggable: true
                    });
                }
            }
        }).catch((errors) => {
            if (errors)
                Swal.fire({
                    title: "Hệ thống đang có vấn đề. Vui lòng thử lại!",
                    icon: "error",
                    draggable: true
                });
        }).finally(() => setLoadingGetDocumentDetail(false));

    }

    const handleShowPopupCreate = () => {
        setFormAction('create');
        resetLecture({ title: '', file_path: '' });
        setShowLecturePopup(true);
    }

    const handleAddLecture = async (lecture: Lecture) => {
        try {
            setLoadingGetDocumentDetail(true);
            const res = await createLecture(lecture);
            if (res) {
                getDocumentDetail();
                resetLecture();
                setShowLecturePopup(false);
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message_validate.title ? errors.response.data.message_validate.title
                    : errors.response.data.message_validate.position ? errors.response.data.message_validate.position : errors.response.data.message,
                icon: "error",
                draggable: true
            });
        } finally { setLoadingGetDocumentDetail(false); }
    };

    const handleDeleteLecture = (id: number) => {
        Swal.fire({
            title: "Bạn có thật sự muốn xóa bài giảng này?",
            showCancelButton: true,
            icon: "question",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoadingGetDocumentDetail(true);
                const res = await deleteLecture(id);
                getDocumentDetail();
                Swal.fire({
                    title: res.data.message,
                    icon: "success",
                    draggable: true
                });
            }
        }).catch((errors) => {
            if (errors)
                Swal.fire({
                    title: "Hệ thống đang có vấn đề. Vui lòng thử lại!",
                    icon: "error",
                    draggable: true
                });
        }).finally(() => setLoadingGetDocumentDetail(false));
    }

    const handleShowPopupUpdate = (id: number) => {
        const data = dataDocument?.chapters.flatMap((chapter) => chapter.lectures)
            .find((lecture) => lecture.id === id);
        if (data) {
            resetLecture(data);
            setShowLecturePopup(true);
            setFormAction('update');
        }
    }

    const handleUpdateLecture = async (lecture: Lecture) => {
        const allValues = getValuesLecture(); // lấy toàn bộ dữ liệu hiện tại
        const updatedValues: Partial<Lecture> = {};
        //Kiểm tra lấy những trường được thay đổi
        for (const key in dirtyFieldsLecture) {
            (updatedValues as any)[key as keyof Lecture] = allValues[key as keyof Lecture];
        }

        if (Object.keys(updatedValues).length === 0) {
            Swal.fire({
                title: "Không có nội dung nào được thay đổi để cập nhật!",
                icon: "warning"
            });
            return;
        }
        try {
            setLoadingGetDocumentDetail(true);
            const res = await updateLecture(lecture.id, lecture.chapter_id, updatedValues);
            setShowLecturePopup(false);
            getDocumentDetail();
            Swal.fire({
                title: res.data.message,
                icon: "success",
                draggable: true
            });
        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message_validate.title ? errors.response.data.message_validate.title
                    : errors.response.data.message_validate.position ? errors.response.data.message_validate.position : errors.response.data.message,
                icon: "error",
                draggable: true
            });
        } finally { setLoadingGetDocumentDetail(false); }
    }


    return (
        <>
            {loadingGetDocumentDetail && <Loadding />}
            <div className="subject-detail-container">
                <h1 className="subject-detail-title">📚 Tài liệu môn {dataDocument?.subject_name}
                    <div className="search-subject">
                        <input type="text" value={query} onChange={(e: any) => setQuery(e.target.value)} placeholder="Tìm kiếm môn học"
                            onFocus={() => setShowListSubjectSearch(true)}
                            onBlur={() => setTimeout(() => setShowListSubjectSearch(false), 150)}
                        />
                        {showListSubjectSearch &&
                            <ul className="suggestion-box">
                                {filteredSubjects.length > 0 ?
                                    filteredSubjects.map((subject) => (
                                        <li key={subject.id}>
                                            <Link to={`${url}/${subject.id}`} className="suggestion-link">{subject.subject_name} </Link>
                                        </li>
                                    )) : <li><Link to="#" className="suggestion-link" style={{ color: '#ccc' }}>Không có dữ liệu phù hợp</Link></li>
                                }
                            </ul>
                        }
                    </div>
                </h1>
                <div className="subject-detail-buttons">
                    <button className="subject-detail-btn " onClick={() => handleShowPopupCreateChapter()}>Thêm chương</button>
                    <button className="subject-detail-btn " onClick={() => handleShowPopupCreate()}>Thêm bài giảng</button>
                </div>
                {/* Hiển thị danh sách chương và bài */}
                {dataDocument?.chapters?.map((chapter, index) => (
                    <div key={chapter.id} className="subject-detail-chapter">
                        <h2 className="subject-detail-chapter-title">Chương {index + 1}: {chapter.title}
                            <FaEdit onClick={() => { hanldeShowPopupUpdateDeleteChapter(chapter.id) }} />
                        </h2>
                        <div className="subject-detail-lecture-list">
                            {chapter?.lectures?.map((lecture, index) => (
                                <div key={lecture.id} className="subject-detail-lecture-item">
                                    <Link to={`${lecture.file_path}`} target="_blank">Bài {index + 1}: {lecture.title}</Link>
                                    <div className="subject-detail-lecture-item-icons">
                                        <MdSaveAs onClick={() => handleShowPopupUpdate(lecture.id)} />
                                        <MdDelete onClick={() => handleDeleteLecture(lecture.id)} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Popup Thêm chương */}
                {showChapterPopup && (
                    <div className="subject-popup-overlay">
                        <div className="subject-popup">
                            <h3>Thêm chương mới</h3>
                            <input
                                type="text"
                                placeholder="Tên chương"
                                {...register("title", { required: "Vui lòng nhập tên chương" })}
                                className="subject-detail-input"
                            />
                            {errors.title && <p className="error-message">{errors.title.message}</p>}
                            <input
                                type="number"
                                placeholder="Thứ tự chương"
                                {...register("position", { required: "Vui lòng nhập thứ tự chương" })}
                                className="subject-detail-input"
                            />
                            {errors.position && <p className="error-message">{errors.position.message}</p>}
                            <div className="popup-actions">
                                {
                                    formAction === 'create' ? <button className="subject-detail-btn green" onClick={handleSubmit(handleAddChapter)}>Thêm</button> :
                                        <>
                                            <button className="subject-detail-btn green" onClick={handleSubmit(hanldeUpdateChapter)}>Cập nhật</button>
                                            <button className="subject-detail-btn-popup btn-delete" onClick={handleSubmit(handleDeleteChapter)}>Xóa</button>
                                        </>
                                }
                                <button className="subject-detail-btn-popup" onClick={() => setShowChapterPopup(false)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Popup Thêm bài giảng */}
                {showLecturePopup && (
                    <div className="subject-popup-overlay">
                        <div className="subject-popup">
                            <h3>Thêm bài giảng mới</h3>
                            <input
                                type="text"
                                {...regiterLecture("title", { required: "Vui lòng nhập tên bài giảng" })}
                                placeholder="Tên bài giảng"
                                className="subject-detail-input"
                            />
                            {lectureErrors.title && <p className="error-message">{lectureErrors.title.message}</p>}
                            <input
                                type="text"
                                {...regiterLecture("file_path", {
                                    required: "Vui lòng nhập đường dẫn của bài giảng",
                                    pattern: {
                                        value: /^https?:\/\/.+/,
                                        message: "Định dạng URL không hợp lệ"
                                    }
                                })}
                                placeholder="Đường dẫn bài giảng"
                                className="subject-detail-input"
                            />
                            {lectureErrors.file_path && <p className="error-message">{lectureErrors.file_path.message}</p>}
                            <input
                                type="number"
                                {...regiterLecture("position", { required: "Vui lòng nhập thứ tự bài giảng" })}
                                placeholder="Thứ tự bài giảng"
                                className="subject-detail-input"
                            />
                            {lectureErrors.position && <p className="error-message">{lectureErrors.position.message}</p>}
                            <select
                                className="subject-detail-select" {...regiterLecture("chapter_id", { required: "Vui lòng chọn chương của bài giảng" })}
                            >
                                <option value="">Chọn chương</option>
                                {dataDocument?.chapters?.map((chapter, index) => (
                                    <option key={index} value={chapter.id}>{chapter.title}</option>
                                ))}
                            </select>
                            {lectureErrors.chapter_id && <p className="error-message">{lectureErrors.chapter_id.message}</p>}
                            <select className="subject-detail-select" {...regiterLecture("status")}  >
                                <option value="public" selected>Hiển thị công khai</option>
                                <option value="private">Hiển thị không công khai</option>
                            </select>
                            <div className="popup-actions">
                                <button className="subject-detail-btn green" onClick={formAction === 'create' ? handleSubmitLecture(handleAddLecture)
                                    : handleSubmitLecture(handleUpdateLecture)
                                }>{formAction === 'create' ? "Thêm" : "Cập nhật"}</button>
                                <button className="subject-detail-btn-popup" onClick={() => setShowLecturePopup(false)}>Hủy</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default SubjectDetail;
