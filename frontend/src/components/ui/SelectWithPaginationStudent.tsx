import { useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { getAllStudents } from "../../services/studentService";
import { StudentStatus } from "../../enums/StudentStatus";

const SelectWithPaginationStudent = ({ hanldeSelected }: any) => {
    const [value, setValue] = useState(null);
    const customComponents = {
        LoadingIndicator: () => null,
    }

    const loadOptionStudents = async (keyword: string, _loadedOptions: any, additional: { page: number } = { page: 1 }, status: StudentStatus = StudentStatus.Active): Promise<any> => {
        try {
            const res = await getAllStudents(keyword, additional.page, status);
            const data = res.data;
            return {
                options: data.students.map((student: any) => ({
                    label: `${student.student_code} - ${student.name}`,
                    value: student.id,
                    data: student
                })),
                hasMore: data.meta.current_page < data.meta.total_pages, // bạn cần trả về từ API
                additional: {
                    page: additional.page + 1,
                },
            };
        } catch (errors) {
            console.error("Load student failed", errors);
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: additional.page,
                },
            };
        }
    }
    return (
        <>
            <AsyncPaginate
                value={value}
                loadOptions={loadOptionStudents}
                onChange={(selected) => {
                    setValue(selected);
                    hanldeSelected(selected);
                }}
                components={customComponents}
                placeholder="-- Thêm sinh viên vào lớp học --"
                additional={{
                    page: 1,
                }}
                debounceTimeout={500}
                loadingMessage={() => 'Đang tải...'}
                noOptionsMessage={() => 'Không tìm thấy dữ liệu phù hợp'}
            />

        </>
    )
}

export default SelectWithPaginationStudent