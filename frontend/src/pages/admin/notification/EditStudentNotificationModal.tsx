import React, { useEffect, useState } from 'react';
import { X, Users } from 'lucide-react';
import './CreateNotificationModal.css';
import { useForm } from 'react-hook-form';
import { HttpStatus } from '../../../enums/HttpStatus';
import Swal from 'sweetalert2';
import { CreateLoading } from '../../../components/ui/CreateLoading';
import { updateStudentNotification } from '../../../services/notificationService';



interface StudentNotification {
    id: number,
    title: string,
    content: string,
    created_at: string,
    sender: string,
    from: string,
    status: string,
    student: Student
}

interface Student {
    id: string,
    name: string,
    student_code: string
}
interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    notification?: StudentNotification;
    onSuccess: () => void;
}
interface FormValues {
    title: string;
    content: string;
    push_notification: string;
    id: number;
}

const EditStudentNotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, notification, onSuccess }) => {
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({});

    console.log(notification);
    useEffect(() => {
        if (notification) {
            reset({
                id: notification.id,
                title: notification.title,
                content: notification.content,
            })
        }
    }, [notification, reset]);
    if (!isOpen) return null;

    const onSubmit = async (data: FormValues) => {
        try {
            console.log(data);
            setCreateLoading(true);
            const res = await updateStudentNotification(data, data.id);
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
                                    Sinh viên nhận *
                                </label>
                                <div> {notification?.student.name}</div>
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


export default EditStudentNotificationModal;