import React, { useRef, useState } from "react";
import "./StudentManagement.css";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onImport: (file: File) => void;
};

const ImportStudentModal: React.FC<Props> = ({ isOpen, onClose, onImport }) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleSubmitImport = () => {
        if (selectedFile) {
            onImport(selectedFile);
            setSelectedFile(null);
        }
    };

    const resetAndClose = () => {
        setSelectedFile(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="import-modal__overlay">
            <div className="import-modal__container">
                <div className="import-modal__header">
                    <h3>📥 Nhập sinh viên từ Excel</h3>
                    <button className="import-modal__close" type="button" onClick={resetAndClose}>
                        &times;
                    </button>
                </div>

                <div
                    className="import-modal__dropzone"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {!selectedFile ? (
                        <>
                            <p>Kéo thả file Excel vào đây</p>
                            <p>hoặc</p>
                            <button
                                className="import-modal__choose"
                                type="button"
                                onClick={triggerFileInput}
                            >
                                Chọn file từ máy tính
                            </button>
                            <p className="import-modal__note">Hỗ trợ file .xlsx, .xls</p>
                        </>
                    ) : (
                        <>
                            <p><strong>📁 File đã chọn:</strong> {selectedFile.name}</p>
                            <div className="import-modal__actions">
                                <button className="import-modal__btn submit" onClick={handleSubmitImport}>
                                    Nhập dữ liệu
                                </button>
                                <button className="import-modal__btn cancel" onClick={() => setSelectedFile(null)}>
                                    Chọn lại
                                </button>
                            </div>
                        </>
                    )}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </div>

                <div className="import-modal__template-warning">
                    <strong>Lưu ý về template Excel:</strong>
                    <ul>
                        <li>Cột A: STT (số thứ tự)</li>
                        <li>Cột B: MSSV (mã sinh viên)</li>
                        <li>Cột C: Họ Tên</li>
                        <li>Cột D: Email</li>
                        <li>Cột E: Ngày sinh (cần đúng định dạng chuỗi Y-m-d)</li>
                        <li>Cột F: Giới tính (Nam, Nữ)</li>
                        <li>Cột G: Địa chỉ</li>
                        <li>Cột H: Thời gian nhập học (cần đúng định dạng chuỗi Y-m-d)</li>
                        <li>Cột I: Thời gian tốt nghiệp (cần đúng định dạng chuỗi Y-m-d)</li>
                        <li>Cột J: Ngành học</li>
                        <li>Cột K: Trạng thái (Đang học, Đã tốt nghiệp, Bị đình chỉ, Thôi học, Bảo lưu)</li>
                        <li>File phải có định dạng <b>.xlsx</b> hoặc <b>.xls</b></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ImportStudentModal;
