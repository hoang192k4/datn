import { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { getListTeacher } from "../../services/teacherService";


interface Selected {
    value: number,
    label: string
}
interface SelectWithPaginationTeacjerProps {
    value: Selected | null;
    handleSelectedTeacher: (selected: Selected) => void;
}
const SelectWithPaginationTeacher = ({ value: propValue, handleSelectedTeacher }: SelectWithPaginationTeacjerProps) => {
    const [value, setValue] = useState<Selected | null>(null);

    const customComponents = {
        LoadingIndicator: () => null,
    };
    const loadOptions = async (search: any, _loadedOptions: any, { page }: { page: number } = { page: 1 }): Promise<any> => {
        try {
            const response = await getListTeacher(search, page);
            const data = response.data;
            return {
                options: data.teachers.map((teacher: any) => ({
                    label: `${teacher.teacher_code} - ${teacher.name}`,
                    value: teacher.id
                })),
                hasMore: data.meta.current_page < data.meta.total_pages,
                additional: {
                    page: page + 1,
                },
            };
        } catch (e) {
            console.log(e);
        }

    };

    useEffect(() => {
        if (propValue)
            setValue(propValue);
        else
            setValue(null);
    }, [propValue])

    return (
        <AsyncPaginate
            value={value}
            loadOptions={loadOptions}
            onChange={(selected) => {
                setValue(selected);
                handleSelectedTeacher(selected as Selected);
            }}
            components={customComponents}
            placeholder="-- Tìm Giảng Viên --"
            additional={{
                page: 1,
            }}
            debounceTimeout={500}
            loadingMessage={() => 'Đang tải...'}
            noOptionsMessage={() => 'Không tìm thấy dữ liệu phù hợp'}
        />
    );
}

export default SelectWithPaginationTeacher