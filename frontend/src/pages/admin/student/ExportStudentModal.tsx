import { useState } from 'react';
import './StudentManagement.css';

interface Props {
    isOpen: boolean;
    isClose: () => void;
    onExport: (status: string) => void;
}
const ExportStudentsModal = ({ isOpen, isClose, onExport }: Props) => {

    const [selectedStatusExport, setSelectedStatusExport] = useState<string>('');
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div className="modal__overlay">
                <div className="modal__container">
                    <h2 className="modal__title">Xuất danh sách theo trạng thái</h2>

                    <div className="modal__field">
                        <label htmlFor="status" className="modal__label">Chọn trạng thái:</label>
                        <select
                            id="status"
                            className="modal__select"
                            value={selectedStatusExport}
                            onChange={(e) => setSelectedStatusExport(e.target.value)}
                        >
                            <option value="">Tất cả trạng thái</option>
                            <option value="active">Đang học</option>
                            <option value="graduated">Đã tốt nghiệp</option>
                            <option value="suspended">Bị đình chỉ</option>
                            <option value="dropped_out">Đã thôi học</option>
                            <option value="pending">Chờ xét duyệt</option>
                            <option value="deferment">Bảo lưu</option>
                        </select>
                    </div>

                    <div className="modal__actions">
                        <button className="modal__button modal__button--export" onClick={() => { onExport(selectedStatusExport); isClose() }}>Export</button>
                        <button className="modal__button modal__button--cancel" onClick={() => isClose()}>Hủy</button>
                    </div>
                </div>
            </div>

        </>
    )
}


export default ExportStudentsModal;