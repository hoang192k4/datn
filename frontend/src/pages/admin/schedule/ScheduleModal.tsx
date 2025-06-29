import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './ScheduleModal.css';
import { Container } from 'lucide-react';
import SelectWithPaginationClassroom from '../../../components/ui/SelectWithPaginationClassroom';

type ScheduleFormData = {
    course_section_id: string;
    day_of_week: string;
    session: string;
    period_start: string;
    period_number: string;
    classroom: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ScheduleFormData) => void;
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
        defaultValues: {
            course_section_id: '',
            day_of_week: '2',
            session: 'morning',
            period_start: '1',
            period_number: '3',
            classroom: '',
        }
    });

    useEffect(() => {
        if (defaultValues) {
            reset(defaultValues);
        }
    }, [defaultValues, reset]);

    const submitHandler = (data: ScheduleFormData) => {
        console.log(data);
        onSubmit(data);
        onClose();
        reset(); // clear form sau khi submit
    };

    if (!isOpen) return null;

    return (
        <div className="schedule-modal-overlay">
            <div className="schedule-modal">
                <h2>{defaultValues ? 'Sửa lịch học' : 'Thêm lịch học'}</h2>
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="schedule-form-group">
                        <label>Lớp học phần</label>
                        <input {...register("course_section_id", { required: true })} />
                        {errors.course_section_id && <small>Không được bỏ trống</small>}
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
                            <option value="0">Chủ nhật</option>
                        </select>
                    </div>

                    <div className="schedule-form-group">
                        <label>Buổi</label>
                        <select {...register("session", { required: true })}>
                            <option value="morning">Sáng</option>
                            <option value="afternoon">Chiều</option>
                        </select>
                    </div>

                    <div className="schedule-form-group">
                        <label>Tiết bắt đầu</label>
                        <input type="number" {...register("period_start", { required: true })} />
                    </div>

                    <div className="schedule-form-group">
                        <label>Số tiết</label>
                        <input type="number" {...register("period_number", { required: true })} />
                    </div>

                    <div className="schedule-form-group">
                        <label>Phòng học</label>
                        <Controller
                            name="classroom"
                            control={control}
                            render={({ field }) => (
                                <SelectWithPaginationClassroom
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )}
                        />

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
