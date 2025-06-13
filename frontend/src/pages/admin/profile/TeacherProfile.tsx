import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import { formatToDisplayDate, formatToInputDate, getInitials } from "../../../utils/stringUtil";
import type { TeacherForm } from "../../../types/teacher";
import { authCheck, teacherUpdate } from "../../../services/authTeacherService";
import { login, logout } from '../../../store/slices/authSlice';
import { HttpStatus } from "../../../enums/HttpStatus";

const TeacherProfile = () => {
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const [showDialogUpdate, setShowDialogUpdate] = useState(false);
    const teacher = useSelector((state: any) => state.auth.user);
    const { register, handleSubmit: validate, reset, formState: { errors } } = useForm<TeacherForm>();
    const dispatch = useDispatch();
    useEffect(() => {
        if (teacher) {
            reset({
                ...teacher,
                date_of_birth: formatToInputDate(teacher.date_of_birth)
            })
        }
    }, [teacher, reset]);
    const handleSubmit = async (data: TeacherForm) => {
        setLoadingUpdate(true);
        try {
            const res = await teacherUpdate(data);
            if (res.status === HttpStatus.SUCCESS) {
                {
                    const userUpdate = {
                        ...data,
                        date_of_birth: formatToInputDate(data.date_of_birth)
                    }
                    dispatch(login({ user: userUpdate }));
                    setShowDialogUpdate(true);
                }
            }
        } catch (errors: any) {
            console.log(errors.response);
        } finally {
            setLoadingUpdate(false);
        }
    }
    return (
        <>
            {loadingUpdate && (
                <div className="loading-overlay">
                    <div className="spinner"></div>
                </div>
            )}
            <form className="card-profile" onSubmit={validate(handleSubmit)}>
                <div className="profile">
                    <div className="avatar-text">{getInitials(teacher.name)}</div>
                    <div className="info">
                        <h2><input type="text" {...register("name", { required: "Vui lòng nhập tên" })} /></h2>
                    </div>
                    {errors.name && <p style={{ color: 'red', padding: '0 10px', fontSize: '13px' }}>{errors.name.message}</p>}
                </div>

                <div className="details-profile">
                    <div className="detail-profile-item">
                        <label htmlFor="date_of_birth">Ngày sinh</label>
                        <input
                            type="date"
                            id="date_of_birth"
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
                        <input type="email" id="email" {...register("email", { required: "Vui lòng nhập email" })} />
                        {errors.email && <p>{errors.email.message}</p>}
                    </div>

                    <div className="detail-profile-item">
                        <label>Tình trạng</label>
                        <select disabled {...register("status")}  >
                            <option value="active">Đang Giảng Dạy</option>
                            <option value="inactive">Kết Thúc Giảng Dạy</option>
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
                    <div className="detail-profile-item">
                        <label>Chức Vụ</label>
                        <select disabled {...register("role")}  >
                            <option value="faculty_admin">Cấp Khoa</option>
                            <option value="department_admin">Cấp Bộ Môn</option>
                            <option value="subject_teacher">Giáo Viên Bộ Môn</option>
                            <option value="homeroom_teacher">Giáo Viên Chủ Nhiệm</option>
                        </select>
                    </div>
                </div>

                <div className="edit-button">
                    <button type="submit">Lưu thay đổi</button>
                </div>
            </form>
            <div id="cpw-overlay" className={showDialogUpdate ? "cpw-overlay show" : "cpw-overlay"} onClick={() => setShowDialogUpdate(false)}>
                <div className="cpw-popup">
                    <h3>✅ Thành công</h3>
                    <p>Đã cập nhật thông tin cá nhân thành công!</p>
                    <button className="cpw-ok-btn" onClick={() => setShowDialogUpdate(false)} >OK</button>
                </div>
            </div>
        </>
    )
}

export default TeacherProfile