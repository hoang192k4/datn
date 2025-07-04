import { useEffect, useMemo, useState } from "react"
import PageHeader from "../../../components/ui/PageHeader"
import type { Meta, TeacherList } from "../../../types/teacher";
import { createTeacher, getListRole, getListTeacher, toggleStatusTeacher, updateTeacher } from "../../../services/teacherService";
import { genderMap } from "../../../utils/genderMap";
import './TeacherManager.css';
import { StatusActiveInactive } from "../../../enums/StatusActiveInactive";
import { teacherRoleMap, teacherStatusMap } from "../../../utils/teacherText";
import { formatDayMonthYear } from "../../../utils/utils";
import { FaEdit, FaLock, FaLockOpen, FaSearch } from "react-icons/fa";
import debounce from "lodash.debounce";
import Swal from "sweetalert2";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { RoleList } from "../../../types/role";
import TeacherImport from "./TeacherImport";
import TeacherExport from "./TeacherExport";
import { Loading } from "../../../components/ui/Loading";
import { AsyncPaginate } from "react-select-async-paginate";
import type { GroupBase, OptionsOrGroups } from "react-select";
import { getListSubjects } from "../../../services/docmentSubjectService";

type OptionType = { value: string | number; label: string };
const TeacherManager = () => {
    const [teacherList, setTeacherList] = useState<TeacherList[]>([]);
    const [roleList, setRoleList] = useState<RoleList[]>([]);
    const [loadingTeacher, setLoadingTeacher] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<StatusActiveInactive | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [keyword, setKeyword] = useState<string>('');
    const [actionTeacher, setActionTeacher] = useState<'create' | 'update' | ''>('');
    const [showPopupImport, setShowPopupImport] = useState(false);
    const [showPopupExport, setShowPopupExport] = useState(false);
    const { register, handleSubmit, reset, formState: { errors, dirtyFields }, getValues, control } = useForm<TeacherList>();
    const password_current = useWatch({
        control,
        name: "password_current",
    });
    const fetchTeacherList = async (key = '', page = 1, status: StatusActiveInactive | null = null, role: string | null = null) => {
        try {
            setLoadingTeacher(true);
            const res = await getListTeacher(key, page, status, role);
            setTeacherList(res.data.teachers)
            setMeta(res.data.meta);
        } catch (errors) {
            console.log(errors);
        } finally { setLoadingTeacher(false); }
    }

    const fetchRoleList = async () => {
        const res = await getListRole();
        setRoleList(res.data);
    }

    useEffect(() => {
        fetchTeacherList(keyword);
        fetchRoleList();
    }, [])

    const handleSearch = useMemo(() => debounce((keyword: string, status: StatusActiveInactive | null, role: string | null) => {
        fetchTeacherList(keyword, 1, status, role);
    }, 500), [])

    const handleSelectStatus = (selectedStatus: StatusActiveInactive | null) => {
        fetchTeacherList(keyword, 1, selectedStatus, selectedRole);
    }

    const handleSelectedRole = (selectedRole: string | null) => {
        fetchTeacherList(keyword, 1, selectedStatus, selectedRole);
    }
    useEffect(() => {
        return () => handleSearch.cancel();
    }, [handleSearch]);

    const handleFetchDataTeacher = (teacherId: number) => {
        setActionTeacher('update');
        const data = teacherList.filter(teacher => teacher.id === teacherId);
        if (data) {
            reset({
                ...data[0],
                subjects: data[0].subjects.map((s) => ({
                    label: s.label,
                    value: s.value,
                }))
            });
        }
    }

    const handleUpdateTeacher = async (teacherUpdate: TeacherList) => {
        const allValues = getValues();
        const updateValues: Partial<TeacherList> = {}
        for (const key in dirtyFields) {
            (updateValues as any)[key as keyof TeacherList] = allValues[key as keyof TeacherList];
        }
        if (Object.keys(updateValues).length === 0) {
            Swal.fire({
                title: "Không có nội dung nào được thay đổi để cập nhật!",
                icon: "warning"
            });
            return;
        }

        try {
            if (updateValues.role_id) {
                const selectedRole = roleList.find(role => role.id == updateValues.role_id);
                if (selectedRole) {
                    updateValues.role = selectedRole.name;
                }
            }
            const payload: any = {
                ...updateValues,
                subjects: teacherUpdate.subjects.map(item => item.value),
            };

            const res = await updateTeacher(teacherUpdate.id, payload);
            if (res) {
                setActionTeacher('');
                Swal.fire({
                    title: res.message,
                    icon: "success",
                    draggable: true
                });
                setTeacherList((prev) => prev.map(item => (
                    item.id === teacherUpdate.id ? { ...item, ...updateValues } : item
                )))
            }
        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message_validate.email || errors.response.data.message_validate.password,
                icon: "error",
                draggable: true
            });
        }
    }
    const handleToggeStatus = (teacherId: number) => {
        Swal.fire({
            title: "Bạn có thật sự muốn thay đổi trạng thái giảng viên?",
            showCancelButton: true,
            icon: "question",
            confirmButtonColor: "#10b981",
            cancelButtonColor: "#d33",
            cancelButtonText: "Hủy",
            confirmButtonText: "Đồng ý",
        }).then(async (result) => {
            if (result.isConfirmed) {
                const res = await toggleStatusTeacher(teacherId);
                if (res) {
                    Swal.fire({
                        title: res.message,
                        icon: "success",
                        draggable: true
                    });
                    setTeacherList(prev => prev.map(teacher => (
                        teacher.id === teacherId ?
                            {
                                ...teacher,
                                status: teacher.status === StatusActiveInactive.Active ? StatusActiveInactive.Inactive : StatusActiveInactive.Active,
                            } : teacher
                    )))
                }
            }
        }).catch((errors) => {
            if (errors)
                console.log(errors);
            Swal.fire({
                title: "Hệ thống đang có vấn đề. Vui lòng thử lại!",
                icon: "error",
                draggable: true
            });
        })
    }

    const handleShowPopup = () => {
        setActionTeacher('create');
        reset({ email: '', name: '', address: '', password: '' });
    }

    const handleCreateTeacher = async (teacher: TeacherList) => {
        try {
            const payload: any = {
                ...teacher,
                subjects: teacher.subjects.map(item => item.value),
            };
            const res = await createTeacher(payload);
            if (res) {
                setActionTeacher('');
                Swal.fire({
                    title: res.message,
                    icon: "success",
                    draggable: true
                }).then(() => {
                    fetchTeacherList();
                });
            }

        } catch (errors: any) {
            Swal.fire({
                title: errors.response.data.message_validate.email || errors.response.data.message_validate.teacher_code,
                icon: "error",
                draggable: true
            });
        }
    }


    const loadOptionsSubject = async (
        search: string,
        _loadedOptions: OptionsOrGroups<OptionType, GroupBase<OptionType>>,
        { page }: { page: number } = { page: 1 }
    ): Promise<{
        options: readonly OptionType[],
        hasMore: boolean,
        additional: { page: number }
    }> => {
        const res = await getListSubjects(search, page);
        const data = res.data;

        const newOptions = data.subjects.map((item: any) => ({
            value: item.id,
            label: `${item.name} - số tính chỉ ${item.credit}`,
        }));

        return {
            options: newOptions,
            hasMore: page < data.meta.total_pages,
            additional: { page: page + 1 },
        };
    }

    return (
        <>

            <PageHeader title="Quản lý giảng viên" subtitle="Hệ thống quản lý giảng viên" />
            <div className="box-container">
                <div className="box-header">
                    <h2>Danh sách giảng viên</h2>
                    <div className="teacher_header_btn">
                        <button className="btn-attendance" onClick={() => setShowPopupImport(true)}>Nhập DS Giảng Viên</button>
                        <button className="btn-attendance" onClick={() => setShowPopupExport(true)}>Xuất DS Giảng Viên</button>
                        <button className="btn-attendance" type="button" onClick={handleShowPopup}>Thêm Mới Giảng Viên</button>
                    </div>
                </div>
                <div className="box-header">
                    <div className="class-search-student">
                        <input type="text" placeholder="Tìm kiếm sinh viên..." onChange={(e) => { handleSearch(e.target.value, selectedStatus, selectedRole); setKeyword(e.target.value) }} />
                        <FaSearch />
                    </div>
                    <div>
                        <select className="select-filter reposive-select-mb" onChange={(e) => {
                            const value = e.target.value;
                            setSelectedRole(value === '' ? null : value);
                            handleSelectedRole(value === '' ? null : value);
                        }
                        } value={selectedRole ?? ''}>
                            <option value="">--Tất Cả Chức Vụ--</option>
                            {roleList && roleList.map(role => (
                                <option key={role.id} value={role.name}>{role.title.toUpperCase()}</option>
                            ))}
                        </select>
                        <select className="select-filter reposive-select-mb" onChange={(e: any) => {
                            const value = e.target.value;
                            handleSelectStatus(value === '' ? null : value as StatusActiveInactive);
                            setSelectedStatus(value === '' ? null : value as StatusActiveInactive)
                        }} value={selectedStatus ?? ''}>
                            <option value="">--Tất Cả--</option>
                            <option value="active">Hoạt Động</option>
                            <option value="inactive">Tạm Ngưng</option>
                        </select>
                    </div>
                </div>

                {loadingTeacher ? <Loading /> :
                    <div className="teacher-manager-list">
                        <table className="teacher-table">
                            <thead>
                                <tr>
                                    <th>Mã Giảng Viên</th>
                                    <th>Họ và Tên</th>
                                    <th>Email</th>
                                    <th>Địa Chỉ</th>
                                    <th>Giới Tính</th>
                                    <th>Ngày Sinh</th>
                                    <th>Vai Trò</th>
                                    <th>Trạng Thái</th>
                                    <th>Phụ Trách Môn Học</th>
                                    <th>Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teacherList.length > 0 ? teacherList?.map((teacher) => (
                                    <tr key={teacher.id}>
                                        <td>{teacher.teacher_code}</td>
                                        <td>{teacher.name}</td>
                                        <td>{teacher.email}</td>
                                        <td>{teacher.address}</td>
                                        <td>{genderMap[teacher.gender]}</td>
                                        <td>{formatDayMonthYear(teacher.date_of_birth)}</td>
                                        <td>
                                            <span className={`role-badge ${teacher.role}`}>
                                                {teacherRoleMap[teacher.role as keyof typeof teacherRoleMap]}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`status-badge ${teacher.status === StatusActiveInactive.Active ? 'status-active' : 'status-inactive'}`}>
                                                {teacherStatusMap[teacher.status]}
                                            </span>
                                        </td>
                                        <td className="subject-tooltip-container">
                                            {teacher.subjects?.length > 0 ? (
                                                <>
                                                    <span className="subject-count">{teacher.subjects.length} môn</span>
                                                    <div className="subject-tooltip">
                                                        <ul>
                                                            {teacher.subjects.map((s) => (
                                                                <li key={s.value}>{s.label}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <span>Chưa cập nhật</span>
                                            )}
                                        </td>
                                        <td>
                                            <button className={`btn-admin  ${teacher.status === StatusActiveInactive.Active ? 'status-active' : 'status-inactive'}`} onClick={() => handleToggeStatus(teacher.id)}>{teacher.status === StatusActiveInactive.Active ? <FaLockOpen /> : <FaLock />}</button>
                                            <button className="btn-admin edit-btn-dmin" onClick={() => handleFetchDataTeacher(teacher.id)}><FaEdit /></button>
                                        </td>
                                    </tr>
                                )) :
                                    <tr>
                                        <td colSpan={9} style={{ textAlign: 'center' }}>Không có giảng viên nào phù hợp với tiêu chí đã chọn</td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <div className="pagination-container-admin">
                            <div className="pagination-controls">
                                <button className="page-btn" onClick={() => meta?.previous_page != null && fetchTeacherList(keyword, meta.previous_page, selectedStatus, selectedRole)} disabled={!meta?.previous_page}>
                                    Trang trước
                                </button>
                                <button className="page-btn active">{meta?.current_page}</button>
                                <button className="page-btn" onClick={() => meta?.next_page != null && fetchTeacherList(keyword, meta.next_page, selectedStatus, selectedRole)} disabled={!meta?.next_page}>
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            {/* form create update teacher */}
            {actionTeacher &&
                <div className="form-modal-overlay" onClick={() => setActionTeacher('')}>
                    <div className="form-modal-box" onClick={(e) => e.stopPropagation()}>
                        <h3>{actionTeacher === 'update' ? 'Cập nhật' : 'Thêm mới'} giảng viên</h3>
                        <form>
                            <label>
                                Họ tên:
                                <input type="text" {...register("name", { required: "Vui lòng nhập họ và tên" })} />
                                {errors.name && <p className="error-message">{errors.name.message}</p>}
                            </label>
                            <label>
                                Email:
                                <input type="email" {...register("email", {
                                    required: "Vui lòng nhập email",
                                    pattern: {
                                        value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                                        message: "Email không hợp lệ"
                                    }
                                })} />
                                {errors.email && <p className="error-message">{errors.email.message}</p>}
                            </label>
                            {actionTeacher == 'create' &&
                                <div className="form-flex">
                                    <label>
                                        Mã GV:
                                        <input type="text" {...register("teacher_code", { required: "Vui lòng nhập mã giảng viên" })} />
                                        {errors.teacher_code && <p className="error-message">{errors.teacher_code.message}</p>}
                                    </label>
                                    <label>
                                        Mật khẩu:
                                        <input type="text" {...register("password", { required: "Vui lòng nhập password" })} />
                                        {errors.password && <p className="error-message">{errors.password.message}</p>}
                                    </label>
                                </div>
                            }
                            <div className="form-flex">
                                <label>
                                    Ngày sinh:
                                    <input type="date" {...register("date_of_birth", { required: "Vui lòng chọn ngày sinh" })} />
                                    {errors.date_of_birth && <p className="error-message">{errors.date_of_birth.message}</p>}
                                </label>
                                <label>
                                    Giới tính:
                                    <select  {...register("gender")}>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                    </select>
                                </label>
                            </div>
                            <label>
                                Địa chỉ:
                                <input type="text" {...register("address", { required: "Vui lòng nhập địa chỉ" })} />
                                {errors.address && <p className="error-message">{errors.address.message}</p>}
                            </label>
                            <label >
                                Môn học:
                                <Controller name="subjects"
                                    control={control}
                                    render={({ field: { onChange, ...field } }) => (
                                        <AsyncPaginate<OptionType, GroupBase<OptionType>, { page: number }, true>
                                            {...field}
                                            isMulti
                                            value={field.value ?? []}
                                            onChange={onChange}
                                            loadOptions={loadOptionsSubject}
                                            additional={{ page: 1 }}
                                            placeholder="Tìm môn học..."
                                            noOptionsMessage={() => "Không tìm thấy môn học"}
                                            loadingMessage={() => "Đang tải..."}
                                            debounceTimeout={500}
                                        />
                                    )}
                                />
                            </label>
                            <div className={actionTeacher === 'update' ? 'form-flex' : ''}>
                                {actionTeacher === 'update' &&
                                    <label>
                                        Mã GV:
                                        <input type="text" disabled {...register("teacher_code")} />
                                    </label>
                                }
                                <label>
                                    Vai trò:
                                    <select {...register("role_id")}>
                                        {roleList && roleList.map(role => (
                                            <option key={role.id} value={role.id}>{role.title}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            {actionTeacher === 'update' &&
                                <div className="form-flex">
                                    <label>
                                        Mật khẩu cũ:
                                        <input type="text" {...register("password_current")} />
                                    </label>

                                    <label>
                                        Mật khẩu mới:
                                        <input type="text" {...register("password_update", {
                                            validate: (value) => {
                                                if (password_current) {
                                                    if (!value) return "Vui lòng nhập xác nhận mật khẩu";
                                                }
                                                return true;
                                            }
                                        })}
                                        />
                                        {errors.password_update && <p className="error-message">{errors.password_update.message}</p>}
                                    </label>
                                </div>
                            }


                            <div className="form-modal-actions">
                                <button type="button" className="btn-save" onClick={handleSubmit(actionTeacher === 'update' ? handleUpdateTeacher : handleCreateTeacher)}>
                                    {actionTeacher === 'create' ? 'Thêm mới giảng viên' : 'Cập nhật'}
                                </button>
                                <button type="button" className="btn-cancel" onClick={() => setActionTeacher('')}>Đóng</button>
                            </div>
                        </form>
                    </div>
                </div>
            }

            {/* component import export */}
            {showPopupImport &&
                <TeacherImport setShowPopupImport={setShowPopupImport} fetchTeacherList={fetchTeacherList} />
            }

            {showPopupExport &&
                <TeacherExport setShowPopupExport={setShowPopupExport} roleList={roleList} />
            }
        </>
    )
}

export default TeacherManager