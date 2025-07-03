import { useState } from "react"
import type { RoleList } from "../../../types/role";
import { exportTeacher } from "../../../services/teacherService";
import Swal from "sweetalert2";

interface PropsExport {
    setShowPopupExport: React.Dispatch<React.SetStateAction<boolean>>,
    roleList: RoleList[],
}
const TeacherExport: React.FC<PropsExport> = ({ setShowPopupExport, roleList }) => {
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const handleExport = async () => {
        try {
            const res = await exportTeacher(selectedStatus, selectedRoleId);
            if (res) {
                const url = window.URL.createObjectURL(res);
                const link = document.createElement('a');
                link.href = url;
                const today = new Date();
                const formattedDate = today.toISOString().split('T')[0];
                const filename = `danh_sach_giang_vien_${formattedDate}.xlsx`;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
                link.remove();
                Swal.fire({
                    title: 'Đã tải file thành công!',
                    icon: "success",
                    draggable: true
                });
                setShowPopupExport(false);
            }
        } catch (errors) {

        }
    }
    return (
        <>
            <div className="teacher-modal-export" onClick={() => setShowPopupExport(false)} >
                <div className="teacher-modal-content-export" onClick={(e) => e.stopPropagation()}>
                    <h2>Xuất Danh Sách Giảng Viên</h2>

                    <label>Chọn trạng thái cần xuất:</label>
                    <select onChange={(e) => {
                        const value = e.target.value;
                        setSelectedStatus(value ? value : null)
                    }} >
                        <option value="">--Tất Cả Trạng Thái --</option>
                        <option value="active">Hoạt động</option>
                        <option value="inactive">Tạm ngưng</option>
                    </select>
                    <label>Chọn chức vụ cần xuất:</label>
                    <select onChange={(e) => {
                        const value = e.target.value;
                        setSelectedRoleId(value ? Number(value) : null)
                    }} >

                        <option value="">-- Tất Cả Chức Vụ --</option>
                        {roleList && roleList.map(role => (
                            <option key={role.id} value={role.id}>{role.title}</option>
                        ))}
                    </select>

                    <div className="button-group">
                        <button onClick={() => setShowPopupExport(false)} >Hủy</button>
                        <button onClick={handleExport}> Xuất Danh Sáchh </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TeacherExport