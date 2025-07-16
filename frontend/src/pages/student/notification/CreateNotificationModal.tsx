import React, { useState } from 'react';
import { X, Users } from 'lucide-react';
import './CreateNotificationModal.css';
import { useForm, Controller } from 'react-hook-form';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { GroupBase, OptionsOrGroups } from 'react-select';
import { sendFeedback } from '../../../services/notificationService';
import { HttpStatus } from '../../../enums/HttpStatus';
import Swal from 'sweetalert2';

import { getTeacherByStudent } from '../../../services/teacherService';
import { Loading } from '../../../components/ui/loading/Loading';




interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}
interface FormValues {
    title: string;
    content: string;
    receiver_ids: number[];
    teacher: { value: number, label: string };
}

type OptionType = { value: string; label: string };

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>({
        defaultValues: {
            title: '',
            content: '',
            receiver_ids: [],
        }
    })
    if (!isOpen) return null;

    const onSubmit = async (data: FormValues) => {


        const receiverIds = [];
        receiverIds.push(data.teacher.value);

        // Thêm giảng viên nếu có chọn
        if (data.teacher?.value) {
            receiverIds.push(data.teacher.value);
        }
        try {
            setCreateLoading(true);

            const res = await sendFeedback(data.title, data.content, receiverIds);
            if (res.status === HttpStatus.SUCCESS) {
                Swal.fire({
                    title: "Gửi phản hồi thành công",
                    icon: "success",
                })
                onSuccess();
                reset();
            }

        } catch (error: any) {
            if (error.response.status === HttpStatus.BAD_REQUEST) {
                Swal.fire({
                    title: "Gửi thông báo thất bại",
                    icon: "warning",
                })
            }
            if (error.response.status === HttpStatus.INTERNAL_SERVER_ERROR) {
                Swal.fire({
                    title: "Có lỗi trong quá trình gửi thông báo",
                    icon: "error",
                })
            }
        } finally {
            onClose();
            setCreateLoading(false);
        }
    }

    const loadOptionsTeacher = async (
        search: string,
        _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: { page: number } = { page: 1 }
    ): Promise<{
        options: readonly OptionType[],
        hasMore: boolean,
        additional: { page: number }
    }> => {
        const res = await getTeacherByStudent(search, page);
        const data = res.data;
        const newOptions = data.teachers.map((item: any) => ({
            value: item.id,
            label: `${item.name} - ${item.email}`,
        }));

        return {
            options: newOptions,
            hasMore: page < data.meta.total_pages,
            additional: { page: page + 1 },
        };
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="notification-modal-overlay">
                    <div className="notification-modal-backdrop" onClick={onClose}></div>
                    <div className="notification-modal-container create-notification-student">
                        <div className="notification-modal-header">
                            <h3 className="notification-modal-title">
                                <div className="notification-modal-icon">
                                    <Users />
                                </div>
                                Gửi phản hồi đến giảng viên
                            </h3>
                            <button
                                onClick={onClose}
                                className="notification-modal-close-btn"
                            >
                                <X />
                            </button>
                        </div>

                        <div className="notification-modal-body">
                            {/* Chọn đối tượng */}
                            <div className="notification-form-group">

                            </div>

                            <div className="notification-form-group">
                                <label className="notification-form-label">
                                    Chọn Giảng Viên *
                                </label>
                                <Controller name="teacher"
                                    rules={{ required: "Giảng viên là bắt buộc" }}
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (
                                        <AsyncPaginate<OptionType, GroupBase<OptionType>, { page: number }, true>
                                            {...field}
                                            onChange={(option) => onChange(option)}
                                            loadOptions={loadOptionsTeacher}
                                            additional={{ page: 1 }}
                                            placeholder="Tìm giảng viên..."
                                            noOptionsMessage={() => "Không tìm thấy giảng viên"}
                                            loadingMessage={() => "Đang tải..."}
                                            debounceTimeout={500}
                                            isClearable

                                        />)} />
                                {errors.teacher && (
                                    <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                                        {errors.teacher.message}
                                    </p>
                                )}
                            </div>

                            {/* Tiêu đề */}
                            <div className="notification-form-group">
                                <label className="notification-form-label">
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"

                                    className="notification-text-input"
                                    placeholder="Nhập tiêu đề..."
                                    {...register("title", { required: true })}
                                />
                                {errors.title && <span className="notification-error-message">* Bắt buộc</span>}
                            </div>

                            {/* Nội dung */}
                            <div className="notification-form-group">
                                <label className="notification-form-label">
                                    Nội dung *
                                </label>
                                <textarea
                                    rows={4}
                                    className="notification-textarea-input"
                                    placeholder="Nhập nội dung..."
                                    {...register("content", { required: true })}
                                />
                                {errors.title && <span className="notification-error-message">* Bắt buộc</span>}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="notification-modal-footer">
                            <button
                                type="button"
                                onClick={onClose}
                                className="notification-cancel-btn"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                className="notification-submit-btn"
                            >
                                Tạo phản hồi
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            {createLoading ? <Loading title="Đang tạo thông báo" /> : <> </>}
        </>
    );
};


export default NotificationModal;