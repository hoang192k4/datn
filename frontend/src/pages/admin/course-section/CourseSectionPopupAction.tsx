import React, { useEffect, useState } from "react";
import type { SemesterList } from "../../../types/semester";
import SelectWithPaginationTeacher from "../../../components/ui/SelectWithPaginationTeacher";
import SelectWithPaginationSubject from "../../../components/ui/SelectWithPaginationSubject";
import SelectWithPaginationClass from "../../../components/ui/SelectWithPaginationClass";
import { useForm } from "react-hook-form";
import type { CourseSection } from "../../../types/courseSecion";
import { createCourseSection, updateCourseSection } from "../../../services/courseSectionService";
import { HttpStatus } from "../../../enums/HttpStatus";
import Swal from "sweetalert2";

interface Selected {
    value: number,
    label: string
}
interface CourseSectionProps {
    setActionCourseSection: React.Dispatch<React.SetStateAction<'create' | 'update' | ''>>;
    actionCourseSection: 'create' | 'update' | '';
    selectedCourseSection: CourseSection | null;
    fetchCourseSectionList: () => void;
    semesterList: SemesterList[];
}
const CourseSectionPopupAction: React.FC<CourseSectionProps> = ({ setActionCourseSection, semesterList,
    fetchCourseSectionList, actionCourseSection, selectedCourseSection }) => {
    const [teacher, setTeacher] = useState<Selected | null>(null);
    const [subject, setSubject] = useState<Selected | null>(null);
    const [selectedClass, setSelectClass] = useState<Selected | null>(null);
    const [errorSubejct, setErrorSubject] = useState<string>('');
    const [courseSectionId, setCourseSectionId] = useState<number | null>(null);
    const { register, handleSubmit, formState: { errors }, getValues, reset, setValue } = useForm<CourseSection>();

    const handleSelectedTeacher = (selectedTeacher: Selected) => {
        setTeacher(selectedTeacher);
        setValue('teacher_id', selectedTeacher.value);
    }

    const handleFormUpdateCreate = () => {
        if (selectedCourseSection) {
            reset(selectedCourseSection);
            setCourseSectionId(selectedCourseSection.id);
            if (selectedCourseSection.teacher_id) {
                setTeacher({
                    label: selectedCourseSection.teacher,
                    value: selectedCourseSection.teacher_id
                });
            }
            else {
                setTeacher(null);
            }
            if (selectedCourseSection.subject_id) {

                setSubject({
                    label: selectedCourseSection.subject,
                    value: selectedCourseSection.subject_id
                });
            }
            else {
                setSubject(null);
            }
            if (selectedCourseSection.class_id) {
                setSelectClass({
                    label: selectedCourseSection.class,
                    value: selectedCourseSection.class_id
                });
            }
            else {
                setSelectClass(null);
            }
        }
        else
            reset({
                semester: { id: 1, name: '' },
                name: '',
                start_date: '',
                end_date: '',
            })
    }

    useEffect(() => {
        handleFormUpdateCreate();
    }, [selectedCourseSection])

    const handleSelectedSubject = (selectedSubject: Selected) => {
        if (selectedSubject) {
            setSubject(selectedSubject);
            setValue("subject_id", selectedSubject.value, { shouldValidate: true });
            setErrorSubject('');
        }
    }
    const handleSelectedClass = (selectedClass: Selected) => {
        if (selectedClass) {
            setSelectClass(selectedClass);
            setValue("class_id", selectedClass.value);
        }
    }

    const hanldeCreateCourseSection = async (formData: CourseSection) => {
        if (!formData.subject_id) {
            setErrorSubject("Vui lòng chọn môn học");
            return;
        }
        formData.semester_id = formData.semester.id;
        try {
            const res = await createCourseSection(formData);
            if (res.status === HttpStatus.SUCCESS) {
                reset();
                setActionCourseSection('');
                Swal.fire({
                    title: res.message,
                    icon: "success",
                }).then(() => {
                    fetchCourseSectionList();
                });
            }
        } catch (errors) {
            console.log(errors);
        }
    }

    const handleUpdateCourseSection = async (formData: CourseSection) => {
        if (!formData.subject_id) {
            setErrorSubject("Vui lòng chọn môn học");
            return;
        }
        let allValues = getValues();
        let updateValues: Partial<CourseSection> = {};

        for (const key in allValues) {
            // Bỏ qua các key không cần check
            if (key === 'id' || key === 'created_at') continue;

            let currentValue = allValues[key as keyof CourseSection];
            let originalValue = selectedCourseSection?.[key as keyof CourseSection];

            if (key === 'semester') {
                currentValue = (currentValue as SemesterList).id;
                originalValue = (originalValue as SemesterList).id;

                if (currentValue !== originalValue) {
                    (updateValues as any)['semester_id'] = currentValue;
                }
            } else {
                if (currentValue !== originalValue) {
                    updateValues[key as keyof CourseSection] = currentValue as any;
                }
            }
        }

        if (Object.keys(updateValues).length === 0) {
            Swal.fire({
                title: "Không có nội dung nào được thay đổi để cập nhật!",
                icon: "warning"
            });
            return;
        }
        try {
            if (courseSectionId) {
                const res = await updateCourseSection(courseSectionId, updateValues);
                if (res.status === HttpStatus.SUCCESS) {
                    setActionCourseSection('');
                    Swal.fire({
                        title: res.message,
                        icon: 'success'
                    }).then(() => {
                        fetchCourseSectionList();
                    });

                }
            }
        } catch (errors: any) {
            console.log(errors);
            Swal.fire({
                title: errors.response.data.message,
                text: errors.response.data.errors,
                icon: 'error'
            });
        }
    }
    return (
        <>
            <div className="form-modal-overlay" onClick={() => setActionCourseSection('')} >
                <div className="form-modal-box" onClick={(e) => e.stopPropagation()}>
                    <h3>Thêm Mới Lớp Học Phần</h3>
                    <form>
                        <div className="form-flex">
                            <label>
                                Giảng Viên:
                                <SelectWithPaginationTeacher handleSelectedTeacher={handleSelectedTeacher} value={teacher} />
                            </label>
                            <label>
                                Lớp Chủ Quản:
                                <SelectWithPaginationClass handleSelectedClass={handleSelectedClass} value={selectedClass} />
                            </label>
                        </div>
                        <div className="form-flex">
                            <label style={{ marginTop: '6px' }}>
                                Môn Học:
                                <SelectWithPaginationSubject handleSelectedSubject={handleSelectedSubject} value={subject} />
                                {errorSubejct && <p className="error-message">{errorSubejct}</p>}
                            </label>
                            <label>
                                Học Kỳ:
                                <select {...register("semester.id")}>
                                    {semesterList && semesterList.map(item => (
                                        <option key={item.id} value={item.id}>
                                            {item.name} ( {item.start_year} - {item.end_year} )
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>
                        <div className="form-flex">
                            <label>
                                Tên Lớp:
                                <input type="text" placeholder="Nhập tên lớp học phần..." {...register("name", { required: "Vui lòng nhập tên lớp" })} />
                                {errors.name && <p className="error-message">{errors.name.message}</p>}
                            </label>

                            <label>
                                Số Tuần:
                                <input type="number" placeholder="Nhập số tuần..." {...register("week_total", { required: "Vui lòng nhập số tuần" })} />
                                {errors.week_total && <p className="error-message">{errors.week_total.message}</p>}
                            </label>
                        </div>
                        <div className="form-flex">
                            <label>
                                Ngày Bắt Đầu:
                                <input type="date" {...register("start_date", { required: "Vui lòng chọn ngày bắt đầu" })} />
                                {errors.start_date && <p className="error-message">{errors.start_date.message}</p>}
                            </label>

                            <label>
                                Ngày Kết Thúc:
                                <input type="date" {...register("end_date", {
                                    required: "Vui lòng chọn ngày kết thúc",
                                    validate: (value) => {
                                        const startDate = getValues("start_date");
                                        if (!startDate) return true;
                                        if (new Date(startDate) >= new Date(value)) {
                                            return "Ngày kết thúc phải lớn hơn ngày bắt đầu";
                                        }
                                        return true;
                                    },
                                })} />
                                {errors.end_date && <p className="error-message">{errors.end_date.message}</p>}
                            </label>
                        </div>


                        <div className="form-modal-actions">
                            <button type="button" className="btn-save button-soft" onClick={handleSubmit(actionCourseSection === 'create' ? hanldeCreateCourseSection : handleUpdateCourseSection)}>
                                {actionCourseSection === 'create' ? 'Thêm' : 'Cập nhật'}
                            </button>
                            <button type="button" className="btn-cancel" onClick={() => { setActionCourseSection('') }}>Đóng</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default CourseSectionPopupAction