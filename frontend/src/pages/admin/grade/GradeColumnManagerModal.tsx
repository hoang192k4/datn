import React, { useEffect } from 'react';
import { useState } from 'react';
import { PublicStatus } from '../../../enums/PublicStatus';
import { deleteGradeColumn } from '../../../services/gradeStudentService';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import './GradeColumnManagerModal.css';
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
    courseSectionId: number | null;
    fetchGradesNoLoading: () => void,
}

const GradeColumnManagerModal: React.FC<Props> = ({
    isOpen,
    onClose,
    gradeColumn,
    courseSectionId,
    fetchGradesNoLoading,
}) => {

    const [gradeColumnManage, setGradeColumnManage] = useState<GradeColumn>({});
    useEffect(() => {
        setGradeColumnManage(gradeColumn);
    }, [gradeColumn])

    const handleDelete = (gradeTypeId: any, attempt: any) => {

        Swal.fire({
            title: "Bạn chắc chắn xóa cột điểm này?",
            text: "Bạn sẽ không thể khôi phục điểm sau khi đã xóa!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vâng, hãy xóa!",
            cancelButtonText: "Hủy"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteGradeColumn(courseSectionId, gradeTypeId, attempt, 'delete');
                    if (response.status) {
                        toast.success('Xóa cột điểm thành công!');
                        setGradeColumnManage(prev => ({
                            ...prev,
                            [gradeTypeId]: prev[gradeTypeId].filter(item => item.attempt !== attempt)
                        }
                        ));
                        fetchGradesNoLoading();
                    }
                } catch (error) {
                }
            }
        });


    }

    const handleUpdateVisibility = (gradeTypeId: any, attempt: any, type: string) => {
        Swal.fire({
            title: "Bạn chắc chắn muốn " + (type === PublicStatus.Public ? "hiển thị" : "ẩn") + " cột điểm này?",
            text: "Điểm sẽ " + (type === PublicStatus.Public ? "hiển thị" : "ẩn") + " cho sinh viên!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Vâng, hãy " + (type === PublicStatus.Public ? "hiển thị" : "ẩn đi") + "!",
            cancelButtonText: "Hủy"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await deleteGradeColumn(courseSectionId, gradeTypeId, attempt, type);
                    if (response.status) {
                        toast.success('Cập nhật cột điểm thành công!');
                        setGradeColumnManage(prev => ({
                            ...prev,
                            [gradeTypeId]: prev[gradeTypeId].map(item => {
                                if (item.attempt === attempt) {
                                    return { ...item, scoreVisibility: type };
                                }
                                return item;
                            })
                        }));
                        fetchGradesNoLoading();
                    }
                } catch (error) {
                }
            }
        });
    }
    return (

        <div
            className={`custom-modal ${isOpen ? 'custom-modal-show' : ''}`}
            tabIndex={-1}
            role="dialog"
        >
            <div className="custom-modal-dialog" role="document">
                <div className="custom-modal-content">
                    <div className="custom-modal-header">
                        <h5 className="custom-modal-title">Quản lý cột điểm</h5>
                        <button type="button" className="custom-btn custom-btn-secondary" onClick={onClose}>
                            Đóng
                        </button>
                    </div>
                    <div className="custom-modal-body">
                        <table className="custom-table">
                            <thead>
                                <tr>
                                    <th>Tên cột điểm</th>
                                    <th className="text-center">Hiển thị</th>
                                    <th className="text-center">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(gradeColumnManage).map(([gradeTypeId, items]) =>
                                    items.map((column: any, index: number) => (
                                        <tr key={index}>
                                            <td>{column.typeName} - {column.attempt}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleUpdateVisibility(gradeTypeId, column.attempt, column.scoreVisibility === PublicStatus.Public ? PublicStatus.Private : PublicStatus.Public)}
                                                    className={`custom-btn custom-btn-sm ${column.scoreVisibility ? 'custom-btn-success' : 'custom-btn-secondary'}`}
                                                >
                                                    {column.scoreVisibility === PublicStatus.Public ? 'Hiển thị' : 'Ẩn'}
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleDelete(gradeTypeId, column.attempt)}
                                                    className="custom-btn custom-btn-sm custom-btn-danger"
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <div className="custom-modal-footer">

                    </div>
                </div>
            </div>
        </div>

    );
};

export default GradeColumnManagerModal;
