import './GradeImport.css';
import React, { useState, useRef } from 'react';
import { Upload, X, FileSpreadsheet } from 'lucide-react';

interface ExcelUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFileSelect: (file: File) => void;
}


const GradeImport: React.FC<ExcelUploadModalProps> = ({
    isOpen,
    onClose,
    onFileSelect
}) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel')) {
            setSelectedFile(file);
        } else {
            alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        }
    };

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        setIsDragging(false);

        const files = event.dataTransfer.files;
        const file = files[0];

        if (file && (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
            file.type === 'application/vnd.ms-excel')) {
            setSelectedFile(file);
        } else {
            alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            onFileSelect(selectedFile);
            onClose();
            setSelectedFile(null);
        }
    };

    const handleBrowseFiles = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <div
                className="modal-overlay"
                onClick={onClose}
            />
            <div className="modal-container">
                <div className="modal-header">
                    <div className="modal-title">
                        <FileSpreadsheet className="title-icon" />
                        Nhập điểm Excel
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="upload-section">
                        <div
                            className={`upload-zone ${isDragging ? 'dragging' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <Upload className="upload-icon" />
                            <div className="upload-text">
                                <p className="primary-text">Kéo thả file Excel vào đây</p>
                                <p className="secondary-text">hoặc</p>
                                <button
                                    className="browse-btn"
                                    onClick={handleBrowseFiles}
                                >
                                    Chọn file từ máy tính
                                </button>
                            </div>
                            <p className="file-info">Hỗ trợ file .xlsx, .xls</p>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={handleFileChange}
                            className="file-input"
                        />
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
                                onClick={() => setSelectedFile(null)}
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    <div className="template-info">
                        <h4>Lưu ý về template Excel:</h4>
                        <ul>
                            <li>Cột A: STT (số thứ tự)</li>
                            <li>Cột B: Họ tên sinh viên</li>
                            <li>Cột C: MSSV (mã sinh viên)</li>
                            <li>Các cột tiếp theo: Điểm các bài kiểm tra theo mẫu khi xuất điểm</li>
                            <li>File phải có định dạng .xlsx hoặc .xls</li>
                        </ul>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>
                        Hủy
                    </button>
                    <button
                        className="upload-submit-btn"
                        onClick={handleUpload}
                        disabled={!selectedFile}
                    >
                        Tải lên
                    </button>
                </div>
            </div>
        </>
    );
}

export default GradeImport;