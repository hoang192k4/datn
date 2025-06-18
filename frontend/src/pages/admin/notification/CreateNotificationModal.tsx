import React, { useState } from 'react';
import { X, Users, User } from 'lucide-react';
import './CreateNotificationModal.css';
import { useForm, Controller } from 'react-hook-form';
import { getCourseSectionByTeacher } from '../../../services/courseSectionService';
import { AsyncPaginate } from 'react-select-async-paginate';
import type { GroupBase, OptionsOrGroups } from 'react-select';
import { sendNotificationToCourseSection, getMyStudents, sendNotificationToStudent } from '../../../services/notificationService';
import { HttpStatus } from '../../../enums/HttpStatus';
import Swal from 'sweetalert2';
import { CreateLoading } from '../../../components/ui/CreateLoading';



const targetConstant = { courseSection: 'course_section', student: 'student' };

interface NotificationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccessTeacher: () => void;
}

interface FormValues {
    target: "course_section" | "student";
    title: string;
    content: string;
    course_section_id?: number;
    students?: { label: string; value: string }[];
    public?: string;
}

type OptionType = { value: string; label: string };

const NotificationModal: React.FC<NotificationModalProps> = ({ isOpen, onClose, onSuccessTeacher }) => {
    const [createLoading, setCreateLoading] = useState<boolean>(false);
    const [target, setTarget] = useState<string>(targetConstant.courseSection); // Default to students
    const { register, handleSubmit, formState: { errors }, control } = useForm<FormValues>({
        defaultValues: {
            target: "course_section"
        }
    })

    if (!isOpen) return null;

    const onSubmit = async (data: FormValues) => {
        console.log("Form Data:", data);
        if (data.target === targetConstant.courseSection) {
            try {
                setCreateLoading(true);

                const res = await sendNotificationToCourseSection({ title: data.title, body: data.content, course_section_id: data.course_section_id, public_type: data.public })
                if (res.status === HttpStatus.SUCCESS) {
                    Swal.fire({
                        title: "Gửi thông báo thành công",
                        icon: "success",
                    })
                    onSuccessTeacher();
                }

            } catch (error: any) {
                if (error.response.status === HttpStatus.BAD_REQUEST) {
                    Swal.fire({
                        title: "Gửi thông báo thành công thất bại",
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
        if (data.target === targetConstant.student) {
            try {
                setCreateLoading(true);

                const receiverIds = data?.students.map((student) => student.value);
                const response = await sendNotificationToStudent({});
            } catch (error: any) {

            } finally {
                setCreateLoading(false);
            }
        }
    };

    const loadOptionsStudent = async (
        search: string,
        _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: { page: number } = { page: 1 }
    ): Promise<{
        options: readonly OptionType[],
        hasMore: boolean,
        additional: { page: number }
    }> => {
        const res = await getMyStudents(search, page);
        const data = res.data.data;

        const newOptions = data.students.map((item: any) => ({
            value: item.id,
            label: `${item.name} - ${item.student_code}`,
        }));

        return {
            options: newOptions,
            hasMore: page < data.meta.total_pages,
            additional: { page: page + 1 },
        };
    };

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
                                Tạo thông báo mới
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
                                    Đối tượng thông báo *
                                </label>
                                <div className="notification-target-options">
                                    <label className="notification-radio-option">
                                        <input
                                            type="radio"
                                            value="course_section"

                                            className="notification-radio-input"
                                            {...register("target", { required: true })}
                                            onChange={() => setTarget(targetConstant.courseSection)}
                                        />
                                        <div className="notification-radio-content">
                                            <Users className="notification-radio-icon" />
                                            <span className="notification-radio-text">Lớp</span>
                                        </div>
                                    </label>
                                    <label className="notification-radio-option">
                                        <input
                                            type="radio"
                                            value="student"

                                            className="notification-radio-input"
                                            {...register("target", { required: true })}
                                            onChange={() => setTarget(targetConstant.student)}
                                        />
                                        <div className="notification-radio-content">
                                            <User className="notification-radio-icon" />
                                            <span className="notification-radio-text">Sinh viên</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Chọn lớp hoặc sinh viên */}
                            {target === 'course_section' ? (
                                <div className="notification-form-group">
                                    <label className="notification-form-label">
                                        Chọn lớp *
                                    </label>
                                    <Controller
                                        key={target}
                                        name="course_section_id"
                                        control={control}
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <AsyncPaginate<OptionType, GroupBase<OptionType>, { page: number } >
                                                {...field}

                                                onChange={(option) => onChange(option?.value)}
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
                            ) : (
                                <div className="notification-form-group">
                                    <label className="notification-form-label">
                                        Chọn sinh viên *
                                    </label>
                                    <Controller name="students"
                                        key={target}
                                        control={control}
                                        render={({ field: { onChange, value, ...field } }) => (
                                            <AsyncPaginate<OptionType, GroupBase<OptionType>, { page: number }, true>
                                                {...field}
                                                isMulti
                                                onChange={(option) => onChange(option)}
                                                loadOptions={loadOptionsStudent}
                                                additional={{ page: 1 }}
                                                placeholder="Tìm sinh viên..."
                                                noOptionsMessage={() => "Không tìm thấy sinh viên"}
                                                loadingMessage={() => "Đang tải..."}
                                                debounceTimeout={500}

                                            />)} />
                                </div>
                            )}

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
                                {errors.title && <span className="notification-error-message">Bắt buộc</span>}
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
                                {errors.title && <span className="notification-error-message">Bắt buộc</span>}
                            </div>
                        </div>
                        {target === 'course_section' ? (
                            <label className="notification-radio-option notification-radio-option-margin">
                                <input
                                    type="radio"
                                    value="private"
                                    className="notification-radio-input"
                                    {...register("public", { required: false })}
                                />
                                <div className="notification-radio-content">
                                    <span className="notification-radio-text">Không hiển thị trên trang chủ</span>
                                </div>
                            </label>
                        ) : <></>}
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
                                Tạo thông báo
                            </button>
                        </div>
                    </div>


                </div>
            </form>
            {createLoading ? <CreateLoading /> : <> </>}
        </>
    );
};



export default NotificationModal;