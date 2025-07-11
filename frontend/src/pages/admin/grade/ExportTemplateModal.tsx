import React, { useState } from "react";
import "./GradeManagement.css";
import { exportGradeTemplate } from "../../../services/gradeStudentService";
import { GradeStatus } from "../../../enums/GradeStatus";

interface GradeItem {
    attempt: number;
    typeName: string;
}

interface GradeColumn {
    [gradeTypeId: number]: GradeItem[];
}

type Props = {
    open: boolean;
    onClose: () => void;
    gradeData: GradeColumn;
    courseSectionId: number;
    columnStatus: string;
};

const ExportTemplateModal: React.FC<Props> = ({ open, onClose, gradeData, courseSectionId, columnStatus }) => {
    const [selectedColumns, setSelectedColumns] = useState<string[]>([]);

    const handleCheckboxChange = (key: string) => {
        setSelectedColumns((prev) =>
            prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
        );
    };

    if (!open) {
        return null;
    }

    const handleExport = async () => {
        try {
            const response = await exportGradeTemplate(courseSectionId, selectedColumns);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            const disposition = response.headers['content-disposition'];
            const match = disposition && disposition.match(/filename="?(.+)"?/);
            const filename = match ? match[1] : 'export.xlsx';

            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
        } catch (error) {
            console.error("Error exporting template:", error);
        }
    }

    return (
        <div className="modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <span className="close" onClick={onClose}>
                    &times;
                </span>
                <h3>📄 Chọn các cột điểm cần xuất</h3>

                <div className="checkbox-group">
                    {columnStatus == GradeStatus.DraftExam && (
                        <>
                            <label key={0} className="checkbox-item">
                                <input
                                    type="checkbox"
                                    onChange={() => handleCheckboxChange("attendance_score")}
                                />
                                Điểm chuyên cần
                            </label>
                            {Object.entries(gradeData).map(([_key, gradeGroup], groupIndex) =>
                                gradeGroup.map((grade: any, index: number) => {
                                    const labelKey = `${grade.typeName} - Lần ${grade.attempt}`;
                                    const value = `${grade.typeCode}_${grade.attempt}`;
                                    return (
                                        <label key={groupIndex + "-" + index} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedColumns.includes(value)}
                                                onChange={() => handleCheckboxChange(value)}
                                            />
                                            {labelKey}
                                        </label>
                                    );
                                })
                            )}
                        </>
                    )}

                    {columnStatus == GradeStatus.SubmittedExam && (
                        <label key={0} className="checkbox-item">
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange("exam1_score")}
                            />
                            Thi lần 1
                        </label>
                    )}

                    {columnStatus == GradeStatus.SubmittedExam1 && (
                        <label key={0} className="checkbox-item">
                            <input
                                type="checkbox"
                                onChange={() => handleCheckboxChange("exam2_score")}
                            />
                            Thi lần 2
                        </label>
                    )}
                </div>

                <div className="action-row">
                    <button
                        className="export-btn"
                        onClick={() => {
                            handleExport();
                            onClose();
                            setSelectedColumns([]);
                        }}
                    >
                        Xuất mẫu
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ExportTemplateModal;
