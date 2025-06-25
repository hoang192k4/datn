import PageHeader from "../../../components/ui/PageHeader";

const StudentManagement = () => {

    return (
        <>
            <PageHeader title="Quản lí sinh viên" subtitle="Hệ thống quản lí sinh viên" />
            <div id="attendance" className="card">
                <h2 className="section-title">Danh Sách Sinh Viên</h2>
                <form id="attendance-form">
                    <table>
                        <thead>
                            <tr>
                                <th> #</th>
                                <th>Mã sinh viên</th>
                                <th>Email</th>
                                <th>Họ tên</th>
                                <th>Ngày sinh</th>
                                <th>Địa chỉ</th>
                                <th>Giới tính</th>
                                <th>Thời gian nhập học</th>
                                <th>Thời gian tốt nghiệp</th>
                                <th>Ngành học</th>
                                <th>Trạng thái</th>
                                <th colSpan={2}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>SV001</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Nguyen Van A</td>
                                <td>Sửa</td>
                                <td>Xóa</td>
                            </tr>

                        </tbody>
                    </table>
                </form>
            </div >
        </>
    )
}

export default StudentManagement;