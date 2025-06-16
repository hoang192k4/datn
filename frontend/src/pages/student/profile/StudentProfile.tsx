import { useEffect } from "react";
import { useSelector } from "react-redux";
import "./StudentProfile.css";
import { getInitials } from "../../../utils/stringUtil";
import { useForm } from "react-hook-form";
import type { StudentForm } from "../../../types/student";

const StudentProfile = () => {
    const user = useSelector((state: any) => state.auth.user);
    const { register, handleSubmit: validate, reset, formState: { errors } } = useForm<StudentForm>();

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    const handleSubmit = (data: StudentForm) => {
        console.log('data đượp cập nhật', data);
    };

    return (
        <form className="card-profile" onSubmit={validate(handleSubmit)}>
            <div className="profile">
                <div className="avatar-text">{getInitials(user.name)}</div>
                <div className="info">
                    <h2>{user.name}</h2>
                    <p>MSSV: {user.student_code}</p>
                    <p>Chuyên Ngành: {user.major}</p>
                </div>
            </div>

            <div className="details-profile">
                <div className="detail-profile-item">
                    <label>Ngày sinh</label>
                    <input
                        type="date"
                        {...register("date_of_birth", { required: "Vui lòng nhập ngày tháng năm sinh" })}
                    />
                    {errors.date_of_birth && <p>{errors.date_of_birth.message}</p>}
                </div>

                <div className="detail-profile-item">
                    <label>Giới tính</label>
                    <select {...register("gender")}>
                        <option value="male">Nam</option>
                        <option value="female">Nữ</option>
                    </select>
                </div>

                <div className="detail-profile-item">
                    <label>Email</label>
                    <input type="email" id="email" {...register("email", { required: "Vui lòng nhập email" })} placeholder="Nhập email..." />
                    {errors.email && <p>{errors.email.message}</p>}
                </div>

                <div className="detail-profile-item">
                    <label>Tình trạng</label>
                    <select disabled {...register("status")}  >
                        <option value="active">Đang Học</option>
                        <option value="graduated">Đã Tốt Nghiệp</option>
                        <option value="suspended">Bị Đình Chỉ</option>
                        <option value="dropped_out">Bỏ học</option>
                        <option value="pedding">Chờ Duyệt </option>
                    </select>
                </div>

                <div className="detail-profile-item full-width">
                    <label>Địa chỉ</label>
                    <input
                        type="text"
                        {...register("address", { required: "Vui lòng nhập địa chỉ" })}
                    />
                    {errors.address && <p>{errors.address.message}</p>}
                </div>
            </div>

            <div className="edit-button">
                <button type="submit">Lưu thay đổi</button>
            </div>
        </form>
    );
}

export default StudentProfile