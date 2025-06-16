import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import { getInitials } from "../../../utils/stringUtil";
import type { TeacherForm } from "../../../types/teacher";
import { teacherUpdate } from "../../../services/authTeacherService";
import { login } from '../../../store/slices/authSlice';
import { HttpStatus } from "../../../enums/HttpStatus";
import Swal from "sweetalert2";
import Loadding from "../../../components/ui/Loadding";


const TeacherProfile = () => {
    const [loadingUpdate, setLoadingUpdate] = useState(false);
    const teacher = useSelector((state: any) => state.auth.user);
    const { register, handleSubmit: validate, reset, formState: { errors } } = useForm<TeacherForm>();
    const dispatch = useDispatch();
    useEffect(() => {
        if (teacher) {
            reset(teacher);
        }
    }, [teacher, reset]);

    const handleSubmit = async (data: TeacherForm) => {
        setLoadingUpdate(true);
        try {
            const res = await teacherUpdate(data);
            if (res.status === HttpStatus.SUCCESS) {
                {
                    dispatch(login({ user: data }));
                    /* setShowDialogUpdate(true); */
                    Swal.fire({
                        title: res.data.message,
                        icon: "success",
                        draggable: true
                    });
                }
            }
        } catch (errors: any) {
            if (errors.response)
                Swal.fire({
                    icon: "error",
                    title: "Thất Bại",
                    text: errors.response.data.message,
                });
        } finally {
            setLoadingUpdate(false);
        }
    }
    return (
        <>
            {loadingUpdate &&  <Loadding/>}
            <form className="card-profile" onSubmit={validate(handleSubmit)}>
                <div className="profile">
                    <div className="avatar-text">{getInitials(teacher.name)}</div>
                    <div className="info">
                        <h2><input type="text" {...register("name", { required: "Vui lòng nhập tên" })} /></h2>
                    </div>
                    {errors.name && <p className="error-message">{errors.name.message}</p>}
                </div>

                <div className="details-profile">
                    <div className="detail-profile-item">
                        <label htmlFor="date_of_birth">Ngày sinh</label>
                        <input
                            type="date"
                            id="date_of_birth"
                            {...register("date_of_birth", { required: "Vui lòng nhập ngày tháng năm sinh" })}
                        />
                        {errors.date_of_birth && <p className="error-message">{errors.date_of_birth.message}</p>}
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
                        {errors.email && <p className="error-message">{errors.email.message}</p>}
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
                        {errors.address && <p className="error-message">{errors.address.message}</p>}
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
        </>
    )
}

export default TeacherProfile