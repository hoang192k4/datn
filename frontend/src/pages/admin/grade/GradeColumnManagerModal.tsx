import React, { useEffect } from 'react';
import { useState } from 'react';
import { PublicStatus } from '../../../enums/PublicStatus';
import { deleteGradeColumn } from '../../../services/gradeStudentService';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
                    const response = await deleteGradeColumn(courseSectionId, gradeTypeId, attempt);
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
                                {Object.entries(gradeColumnManage).map(([gradeTypeId, items]) => (
                                    items.map((column: any, index: number) => {
                                        return <tr key={index}>
                                            <td>{column.typeName} - {column.attempt}</td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => { }}
                                                    className={`btn btn-sm ${column.scoreVisibility ? 'btn-success' : 'btn-secondary'
                                                        }`}
                                                >
                                                    {column.scoreVisibility === PublicStatus.Public ? 'Hiển thị' : 'Ẩn'}
                                                </button>
                                            </td>
                                            <td className="text-center">
                                                <button
                                                    onClick={() => handleDelete(gradeTypeId, column.attempt)}
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
            <ToastContainer />
        </div>
    );
};

export default GradeColumnManagerModal;
