import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { StudentStatus } from "../../../enums/StudentStatus";
import { statusMap } from "../../../utils/studentText";
import type { Major } from "../../../types/major";
import Swal from "sweetalert2";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    initialData?: any;
    majors: Major[] | undefined;

};

const StudentModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData, majors }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, dirtyFields },
        getValues,
        watch,
    } = useForm({
        defaultValues: initialData || {
            name: "",
            email: "",
            password_confirmation: null,
            password: null,
            student_code: "",
            address: "",
            date_of_birth: "",
            enrollment_date: "",
            graduation_date: "",
            gender: "male",
            major_id: "",
            status: StudentStatus.Active,
        },
    });

    const submitHandler = () => {
        const allValues = getValues();
        let dataToSend = {};
        if (initialData) {
            // Nếu là sửa → chỉ lấy các field đã chỉnh sửa
            dataToSend = Object.keys(dirtyFields).reduce((acc: any, key) => {
                acc[key] = allValues[key];
                return acc;
            }, {});

            // Nếu không có gì thay đổi thì không gửi
            if (Object.keys(dataToSend).length === 0) {
                Swal.fire({
                    title: "Chú ý!",
                    icon: "warning",
                    text: "Không có dữ liệu thay đổi khi cập nhật!"
                })
                onClose();
                return;
            }

            // Đảm bảo có id để cập nhật backend
            (dataToSend as any).id = initialData.id;
        } else {
            // Nếu là thêm mới → gửi toàn bộ
            dataToSend = allValues;
        }

        onSubmit(dataToSend);
        reset(); // reset sau khi submit
    };


    useEffect(() => {
        if (initialData) {
            reset(initialData);
        } else {
            reset({
                name: "",
                email: "",
                password: "",
                student_code: "",
                address: "",
                date_of_birth: "",
                enrollment_date: "",
                graduation_date: "",
                gender: "male",
                major_id: "",
                status: StudentStatus.Active,
            });
        }
    }, [initialData, reset]);

    if (!isOpen) return null;

    return (
        <div className="student-modal__overlay">
            <div className="student-modal__container">
                <h2 className="student-modal__title">
                    {initialData ? "Sửa sinh viên" : "Thêm sinh viên"}
                </h2>

                <form onSubmit={handleSubmit(submitHandler)} className="student-modal__form-grid">
                    {[
                        { name: "name", label: "Họ tên", required: true },
                        { name: "email", label: "Email", required: true, type: "email" },
                        { name: "student_code", label: "Mã sinh viên", required: true },
                        { name: "address", label: "Địa chỉ" },
                        { name: "date_of_birth", label: "Ngày sinh", type: "date", required: true },
                        { name: "enrollment_date", label: "Ngày nhập học", type: "date", required: true },
                        { name: "graduation_date", label: "Ngày tốt nghiệp", type: "date" },

                    ].map(({ name, label, type, required }) => (
                        <div className="student-modal__form-group" key={name}>
                            <label>{label}</label>
                            <input
                                type={type || "text"}
                                {...register(name, required ? { required: "Bắt buộc" } : {})}
                            />
                            {errors[name] && (
                                <span className="student-modal__error">{(errors as any)[name].message}</span>
                            )}
                        </div>
                    ))}

                    <div className="student-modal__form-group">
                        <label>Giới tính</label>
                        <select {...register("gender")}>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                        </select>
                    </div>
                    {initialData ? (
                        <>
                            <div className="student-modal__form-group">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: false, validate: (value) =>
                                            !/\s/.test(value) || 'Password không được chứa khoảng trắng'
                                    })}
                                />
                                {errors['password'] && (
                                    <span className="student-modal__error">{(errors as any)['password'].message}</span>
                                )}
                            </div>
                            <div className="student-modal__form-group">
                                <label>Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    {...register("password_confirmation", {
                                        validate: (value) =>
                                            value === watch("password") || "Mật khẩu xác nhận không khớp",
                                    })}
                                />
                                {errors['password_confirmation'] && (
                                    <span className="student-modal__error">{(errors as any)['password_confirmation'].message}</span>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="student-modal__form-group">
                                <label>Mật khẩu</label>
                                <input
                                    type="password"
                                    {...register('password', {
                                        required: "Bắt buộc", validate: (value) =>
                                            !/\s/.test(value) || 'Password không được chứa khoảng trắng'
                                    })}
                                />
                                {errors['password'] && (
                                    <span className="student-modal__error">{(errors as any)['password'].message}</span>
                                )}
                            </div>
                            <div className="student-modal__form-group">
                                <label>Xác nhận mật khẩu</label>
                                <input
                                    type="password"
                                    {...register("password_confirmation", {
                                        validate: (value) =>
                                            value === watch("password") || "Mật khẩu xác nhận không khớp",
                                    })}
                                />
                                {errors['password_confirmation'] && (
                                    <span className="student-modal__error">{(errors as any)['password_confirmation'].message}</span>
                                )}
                            </div>
                        </>
                    )}

                    <div className="student-modal__form-group">
                        <label>Ngành học</label>
                        <select {...register("major_id", { required: "Bắt buộc chọn ngành" })}>
                            <option value="">-- Chọn ngành --</option>
                            {majors?.map((major) => (
                                <option key={major.id} value={major.id}>
                                    {major.name}
                                </option>
                            ))}
                        </select>
                        {errors.major_id && typeof errors.major_id === "object" && "message" in errors.major_id && (
                            <span className="student-modal__error">{(errors.major_id as { message?: string }).message}</span>
                        )}
                    </div>

                    <div className="student-modal__form-group">
                        <label>Trạng thái</label>
                        <select {...register("status")}>
                            {Object.entries(StudentStatus).map(([key, value]) => (
                                <option key={key} value={value}>
                                    {statusMap[value]}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="student-modal__actions">
                        <button type="button" className="student-modal__btn cancel" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="student-modal__btn submit">
                            Lưu
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentModal;
