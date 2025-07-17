import type React from "react"
import SelectWithPaginationTeacher from "../../../components/ui/SelectWithPaginationTeacher"
import { useEffect, useState, type SetStateAction } from "react"
import HandleStudentclass from "./HandleStudentClass";
import { useForm } from "react-hook-form";
import type { ClassForm } from "../../../types/classes";
import { createClass, updateClass } from "../../../services/classServices";
import { HttpStatus } from "../../../enums/HttpStatus";
import Swal from "sweetalert2";

interface Selected {
    value: number,
    label: string
}

interface PropsClass {
    actionClass: 'create' | 'update' | '',
    setActionClass: React.Dispatch<SetStateAction<'create' | 'update' | ''>>;
    fetchListClass: () => void;
    detailClass: any;
}
const ClassOfficialPopup: React.FC<PropsClass> = ({ actionClass, setActionClass, fetchListClass, detailClass }: PropsClass) => {
    const [errorTeacher, setErrorTeacher] = useState<string>('');
    const [teacher, setTeacher] = useState<Selected | null>(null);
    const [open, setOpen] = useState(false);
    const [selectedStudentId, setSelectedStudentId] = useState<number[]>([]);
    const [classId, setClassId] = useState<number>();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, reset } = useForm<ClassForm>();

    const handleSelectedTeacher = (selectedTeacher: Selected) => {
        setTeacher(selectedTeacher);
        setErrorTeacher('');
        setValue('teacher_id', selectedTeacher.value);
    }

    useEffect(() => {
        if (detailClass && actionClass === 'update') {
            reset(detailClass);
            setClassId(detailClass.id);
            setTeacher({
                label: detailClass.teacher_name,
                value: detailClass.teacher_id
            });
            setSelectedStudentId(detailClass.studentsId);
        } else {
            setSelectedStudentId([]);
            reset({ name: '', start_time: '', end_time: '' });
            setTeacher(null);
        }
    }, [detailClass, actionClass])

    const handleCreateClass = async (data: ClassForm) => {
        if (!data.teacher_id) {
            setErrorTeacher('Vui lòng chọn giảng viên chủ nhiệm');
            return;
        }
        if (selectedStudentId.length > 0)
            data.studentsId = selectedStudentId;
        try {
            const res = await createClass(data);
            if (res.status === HttpStatus.SUCCESS) {
                setActionClass('');
                Swal.fire({
                    title: res.message,
                    icon: 'success'
                }).then(() => {
                    fetchListClass();
                });
            }
        } catch (errors) {
            console.log(errors);
        }
    }

    const handleUpdateClass = async (data: ClassForm) => {
        if (!data.teacher_id) {
            setErrorTeacher("Vui lòng chọn giảng viên chủ nhiệm");
            return;
        }
        data.studentsId = selectedStudentId;
        try {
            if (classId) {
                const res = await updateClass(data, classId);
                if (res.status === HttpStatus.SUCCESS) {
                    setActionClass('');
                    Swal.fire({
                        title: res.message,
                        icon: 'success'
                    }).then(() => {
                        fetchListClass();
                    });
                }
            }
        } catch (errors) {
            console.log(errors);
        }
    }

    return (
        <div className="form-modal-overlay" onClick={() => setActionClass('')} >
            <div className="form-modal-box" onClick={(e) => e.stopPropagation()}>
                <h3>Thêm Mới Lớp Chính Khóa</h3>
                <form>
                    <div className="form-flex">
                        <label >
                            Tên lớp:
                            <input type="text" placeholder="Nhập tên lớp..." {...register('name', { required: "Vui lòng nhập tên lớp" })} />
                            {errors.name && <p className="error-message">{errors.name.message}</p>}
                        </label>
                        <label style={{ marginTop: '4px' }}>
                            Giảng Viên:
                            <SelectWithPaginationTeacher handleSelectedTeacher={handleSelectedTeacher} value={teacher} />
                            {errorTeacher && <p className="error-message">{errorTeacher}</p>}
                        </label>
                    </div>

                    <div className="form-flex">
                        <label >
                            Thời gian bắt đầu:
                            <input type="date"  {...register('start_time', { required: "Vui lòng chọn ngày bắt đầu" })} />
                            {errors.start_time && <p className="error-message">{errors.start_time.message}</p>}
                        </label>
                        <label >
                            Thời gian kết thúc:
                            <input type="date"  {...register("end_time", {
                                required: "Vui lòng chọn ngày kết thúc",
                                validate: (value) => {
                                    const startDate = getValues("start_time");
                                    if (!startDate) return true;
                                    if (new Date(startDate) >= new Date(value)) {
                                        return "Ngày kết thúc phải lớn hơn ngày bắt đầu";
                                    }
                                    return true;
                                },
                            })} />
                            {errors.end_time && <p className="error-message">{errors.end_time.message}</p>}
                        </label>
                    </div>



                    <div className="form-modal-actions" style={{justifyContent:'space-between',alignItems:'center'}}>
                        <button type="button" style={{marginTop:'0'}} className="btn-attendance" onClick={() => setOpen(true)}>Thêm mới sinh viên ({selectedStudentId.length})</button>

                        <div>
                            <button type="button" className="btn-save button-soft" onClick={handleSubmit(actionClass === 'create' ? handleCreateClass : handleUpdateClass)}>
                                {actionClass === 'create' ? 'Thêm' : 'Cập nhật'}
                            </button>
                            <button type="button" className="btn-cancel" style={{marginLeft:'8px'}} onClick={() => { setActionClass('') }}>Đóng</button>
                        </div>
                    </div>

                </form>
            </div>
            {
                open && <HandleStudentclass setOpen={setOpen} setSelectedStudentId={setSelectedStudentId} selectedStudentId={selectedStudentId} />
            }
        </div>
    )
}

export default ClassOfficialPopup