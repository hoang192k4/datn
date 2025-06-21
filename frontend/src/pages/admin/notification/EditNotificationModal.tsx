import React, { useEffect, useState } from 'react';
import { X, Users } from 'lucide-react';
import './CreateNotificationModal.css';
import { useForm, Controller } from 'react-hook-form';
import { getCourseSectionByTeacher } from '../../../services/courseSectionService';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { GroupBase, OptionsOrGroups } from 'react-select';
import { HttpStatus } from '../../../enums/HttpStatus';
import Swal from 'sweetalert2';
import { CreateLoading } from '../../../components/ui/CreateLoading';
import { updatePost } from '../../../services/notificationService';




interface CourseSection {
    id: number,
    name: string,
}

interface NotificationCourseSection {
    id: number;
    title: string;
    content: string;
    created_at?: string;
    teacher?: string;
    course_section: CourseSection;
    status: string;
}
interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification?: NotificationCourseSection;
    onSuccess: () => void;
}
interface FormValues {
    title: string;
    content: string;
    course_section_id?: OptionType;
    status?: string|boolean;
    push_notification: string;
    id: number;
}

type OptionType = { value: string | number; label: string };

const EditNotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notification, onSuccess }) => {
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, control, reset } = useForm<FormValues>({});

    useEffect(() => {
        if (notification) {
            reset({
                id: notification.id,
                title: notification.title,
                content: notification.content,
                course_section_id: {
                    label: notification.course_section.name,
                    value: notification.course_section.id
                },
                status: notification.status === "private",
            })
        }
    }, [notification, reset]);
    if (!isOpen) return null;

    const onSubmit = async (data: FormValues) => {
        data.status = data.status ? 'private' : 'public';
        try {
            setCreateLoading(true);
            const res = await updatePost(data, data.id);
            if (res.status === HttpStatus.SUCCESS) {
                Swal.fire({
                    title: "Cập nhật thông báo thành công",
                    icon: "success",
                })
                onSuccess();
            }
        } catch (error: any) {
            if (error.response.status === HttpStatus.BAD_REQUEST) {
                Swal.fire({
                    title: "Gửi thông báo thất bại",
                    icon: "error",
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


    const loadOptionsCourseSection = async (
        search: string,
        _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: { page: number } = { page: 1 }
    ): Promise<{
        options: readonly OptionType[],
        hasMore: boolean,
        additional: { page: number }
    }> => {
        const res = await getCourseSectionByTeacher(search, page);
        const data = res.data.data;

        const newOptions = data.course_sections.map((item: any) => ({
            value: item.id,
            label: item.name,
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
                    <div className="notification-modal-container">
                        <div className="notification-modal-header">
                            <h3 className="notification-modal-title">
                                <div className="notification-modal-icon">
                                    <Users />
                                </div>
                                Sửa thông báo
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
                                <label className="notification-form-label">
                                    Chọn lớp *
                                </label>
                                <Controller
                                    name="course_section_id"
                                    control={control}
                                    render={({ field: { onChange, value, ...field } }) => (

                                        <AsyncPaginate<OptionType, GroupBase<OptionType>, { page: number } >
                                            {...field}
                                            value={value}
                                            onChange={(option) => onChange(option)}
                                            loadOptions={loadOptionsCourseSection}
                                            placeholder="Chọn lớp"
                                            isClearable
                                            loadingMessage={() => "Đang tải..."}
                                            noOptionsMessage={() => "Không có dữ liệu"}
                                            debounceTimeout={500}
                                        />
                                    )}
                                />
                            </div>


                            {/* Tiêu đề */}
                            <div className="notification-form-group">
                                <label className="notification-form-label">
                                    Tiêu đề *
                                </label>
                                <input
                                    type="text"

                                    className="notification-text-input"
                                    placeholder="Nhập tiêu đề thông báo..."
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
                                    placeholder="Nhập nội dung thông báo..."
                                    {...register("content", { required: true })}
                                />
                                {errors.title && <span className="notification-error-message">* Bắt buộc</span>}
                            </div>
                        </div>

                        <label className="notification-radio-option notification-radio-option-margin">
                            <input
                                type="checkbox"
                                className="notification-radio-input"
                                {...register("status", { required: false })}
                            />
                            <div className="notification-radio-content">
                                <span className="notification-radio-text">Không hiển thị trên trang chủ</span>
                            </div>
                        </label>


                        <label className="notification-radio-option notification-radio-option-margin">
                            <input
                                type="checkbox"
                                value="true"
                                className="notification-radio-input"
                                {...register("push_notification", { required: false })}
                            />
                            <div className="notification-radio-content">
                                <span className="notification-radio-text">Gửi lại thông báo đẩy</span>
                            </div>
                        </label>
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
                                Cập nhật thông báo
                            </button>
                        </div>
                    </div>


                </div>
            </form>
            {createLoading ? <CreateLoading title="Đang cập nhật thông báo" /> : <> </>}
        </>
    );
}


export default EditNotificationModal;