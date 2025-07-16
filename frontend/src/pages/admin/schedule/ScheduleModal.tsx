import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './ScheduleModal.css';
import SelectWithPaginationClassroom from '../../../components/ui/SelectWithPaginationClassroom';
import SelectWithPaginationCourseSection from '../../../components/ui/SelectWithPaginationCourseSection';

type ScheduleFormData = {
    id?: number;
    course_section: { value: number | null, label: string | null };
    day_of_week: string;
    period_start: number | null;
    period_number: number | null;
    classroom: { value: number | null, label: string | null };
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ScheduleFormData) => Promise<boolean>;
    defaultValues?: ScheduleFormData; // nếu có thì là sửa
};

const ScheduleModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, defaultValues }) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors }
    } = useForm<ScheduleFormData>({
        defaultValues: defaultValues || {
            day_of_week: '1',
            period_start: null,
            period_number: null,

        }
    });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        } else {
            reset({
                day_of_week: '1',
                period_start: null,
                period_number: null,
            })
        }
    }, [defaultValues, reset]);

    const submitHandler = async (data: ScheduleFormData) => {
        const success = await onSubmit(data);
        console.log(success);
        if (success) {
            onClose();
            reset();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="schedule-modal-overlay">
            <div className="schedule-modal">
                <h2>{defaultValues ? 'Sửa lịch học' : 'Thêm lịch học'}</h2>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="schedule-form-group">
                        <label>Lớp học phần</label>
                        <Controller
                            name="course_section"
                            rules={{ required: 'Vui lòng chọn lớp học phần' }}
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <SelectWithPaginationCourseSection
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {fieldState.error && (
                                        <small className="schedule-error">{fieldState.error.message}</small>

                                    )}
                                </>
                            )}
                        />

                    </div>
                    <div className="schedule-form-group">
                        <label>Phòng học</label>
                        <Controller
                            name="classroom"
                            control={control}
                            rules={{ required: 'Vui lòng chọn phòng học' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <SelectWithPaginationClassroom
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                    {fieldState.error && (
                                        <small className="schedule-error">{fieldState.error.message}</small>

                                    )}
                                </>

                            )}
                        />

                    </div>

                    <div className="schedule-form-group">
                        <label>Thứ</label>
                        <select {...register("day_of_week", { required: true })}>
                            <option value="1">Thứ 2</option>
                            <option value="2">Thứ 3</option>
                            <option value="3">Thứ 4</option>
                            <option value="4">Thứ 5</option>
                            <option value="5">Thứ 6</option>
                            <option value="6">Thứ 7</option>
                            <option value="7">Chủ nhật</option>
                        </select>
                    </div>

                    {/* <div className="schedule-form-group">
                        <label>Buổi</label>
                        <select {...register("session", { required: true })}>
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                        </select>
                    </div> */}

                    <div className="schedule-form-group">
                        <label>Tiết bắt đầu</label>
                        <input type="number" {...register("period_start", { required: true })} />
                        {errors.period_start && <small className="schedule-error"> * Vui lòng nhập tiết bắt đầu</small>}
                    </div>

                    <div className="schedule-form-group">
                        <label>Số tiết</label>
                        <input type="number" {...register("period_number", { required: true })} />
                        {errors.period_number && <small className="schedule-error"> * Vui lòng nhập số tiết học</small>}
                    </div>

                    <div className="schedule-form-actions">
                        <button type="submit" className="schedule-btn">
                            {defaultValues ? 'Cập nhật' : 'Lưu'}
                        </button>
                        <button type="button" className="schedule-btn schedule-btn-cancel" onClick={onClose}>
                            Hủy
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ScheduleModal;
