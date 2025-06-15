import React from 'react';
import { PublicStatus } from '../../../enums/PublicStatus';

interface GradeItem {
    attempt: number;
    typeName: string;
}

interface GradeColumn {
    [gradeTypeId: number]: GradeItem[];
}

interface Props {
    isOpen: boolean;
    onClose: () => void;
    gradeColumn: GradeColumn;
    onToggleVisibility: (id: number) => void;
    onDelete: (id: number) => void;
    courseSectionId: number;
}

const GradeColumnManagerModal: React.FC<Props> = ({
    isOpen,
    onClose,
    gradeColumn,
    onToggleVisibility,
    onDelete,
    courseSectionId,
}) => {

    return (
        <div
            className={`modal fade ${isOpen ? 'show d-block' : ''}`}
            tabIndex={-1}
            role="dialog"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
            <div className="modal-dialog modal-lg" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Quản lý cột điểm</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <table className="table table-bordered">
                            <thead className="table-light">
                                <tr>
                                    <th>Tên cột điểm</th>
                                    <th className="text-center">Hiển thị</th>
                                    <th className="text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(gradeColumn).map(([typeId, items]) => (
                                    items.map((column: any, index: number) => {
                                        return <tr key={index}>
                                            <td>{column.typeName} - {column.attempt}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => onToggleVisibility(column.id)}
                                                    className={`btn btn-sm ${column.scoreVisibility ? 'btn-success' : 'btn-secondary'
                                                        }`}
                                                >
                                                    {column.scoreVisibility === PublicStatus.Public ? 'Hiển thị' : 'Ẩn'}
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => onDelete(column.id)}
                                                    className="btn btn-sm btn-danger"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    })
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradeColumnManagerModal;
