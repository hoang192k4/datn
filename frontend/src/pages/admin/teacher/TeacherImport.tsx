import { FileSpreadsheet, X } from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { importTeacher } from "../../../services/teacherService";
import { HttpStatus } from "../../../enums/HttpStatus";


interface PropsImport {
    setShowPopupImport: React.Dispatch<React.SetStateAction<boolean>>,
    setsetLoadingTeacher: React.Dispatch<React.SetStateAction<boolean>>,
    fetchTeacherList: () => void,
}
const TeacherImport = ({ setShowPopupImport, setsetLoadingTeacher, fetchTeacherList }: PropsImport) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setSelectedFile(event.target.files[0]);
        }
    }
    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];

        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel')) {
            setSelectedFile(file);
        } else {
            Swal.fire({
                title: "Vui lòng chọn file Excel (.xlsx hoặc .xls)",
                icon: 'warning'
            })
        }
    };

    const handleClickFile = () => {
        fileInputRef.current?.click()
    }
    
    const handleUploadFile = async () => {
        if (!selectedFile) {
            Swal.fire({
                title: 'Vui lòng chọn tệp nhập điểm danh (Excel)',
                icon: "error",
            })
            return;
        }
        const formData = new FormData();
        formData.append("file", selectedFile);
        try {
            setsetLoadingTeacher(true);
            const res = await importTeacher(formData);
            if (res.status === HttpStatus.SUCCESS) {
                setShowPopupImport(false);
                fetchTeacherList();
                Swal.fire({
                    title: res.message,
                    icon: "success",
                    draggable: true
                });
            }
        } catch (error: any) {
            if (error.response.data.status === HttpStatus.UNPROCESSABLE_ENTITY) {
                const errors = error.response.data.errors;
                const html = errors.map((err: any) => `<li>Ở dòng ${err.row} ${err.errors}</li>`).join('');
                Swal.fire({
                    title: error.response.data.message,
                    icon: 'error',
                    html: `<ul> ${html}</ul>`
                })
            }
        } finally { setsetLoadingTeacher(false); }
    }
    return (
        <>
            <div id="importExcelModal" className="teacher-modal" onClick={() => setShowPopupImport(false)}>
                <div className="teacher-modal-content" onClick={(e) => e.stopPropagation()}>
                    <span className="close-btn" onClick={() => setShowPopupImport(false)}>&times;</span>
                    <h2>Nhập danh sách giảng viên</h2>

                    <div id="dropZone" className="drop-zone"
                        onClick={handleClickFile}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleDrop}>
                        <p>Kéo thả file Excel vào đây</p>
                        <p>hoặc</p>
                        <button type="button" >Chọn file từ máy tính</button>
                        <p className="note">Hỗ trợ file .xlsx, .xls</p>
                        <input type="file" id="excelFile" accept=".xlsx,.xls" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileSelected} />
                    </div>
                    {selectedFile && (
                        <div className="selected-file">
                            <FileSpreadsheet className="file-icon" />
                            <div className="file-details">
                                <p className="file-name">{selectedFile.name}</p>
                                <p className="file-size">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                            <button
                                className="remove-file-btn"
                                onClick={() => {
                                    setSelectedFile(null)
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}
                    <div className="template-note">
                        <strong>Lưu ý về template Excel:</strong>
                        <ul>
                            <li>Cột A: STT (số thứ tự)</li>
                            <li>Cột B: Mã Giảng Viên</li>
                            <li>Cột C: Email</li>
                            <li>Các D: Họ và Tên</li>
                            <li>Các E: Ngày Sinh</li>
                            <li>Các F Giới Tính (Nam hoặc Nữ)</li>
                            <li>Các G: Địa Chỉ</li>
                            <li>Các H: Vai trò (GVBM ,GVCM, QTKHOA hoặc QTBOMON)</li>
                            <li>File phải có định dạng .xlsx hoặc .xls</li>
                        </ul>
                    </div>

                    <div className="button-group">
                        <button onClick={() => setShowPopupImport(false)}>Hủy</button>
                        <button onClick={handleUploadFile} disabled={!selectedFile}>Tải lên</button>
                    </div>
                </div>
            </div>

        </>
    )
}

export default TeacherImport