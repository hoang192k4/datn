import { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { getCourseSectionByTeacher } from '../../services/courseSectionService'

const SelectWithPagination = ({ handleClassSelection }: any) => {
    const [value, setValue] = useState(null);

    const customComponents = {
        LoadingIndicator: () => null, // ẩn loading spinner
    };
    const loadOptions = async (search: any, _loadedOptions: any, { page }: { page: number } = { page: 1 }): Promise<any> => {
        try {
            const response = await getCourseSectionByTeacher(search, page);
            const data = response.data.data;
            return {
                options: data.course_sections.map((cls: any) => ({
                    label: `${cls.name} - ${cls.students_total} sinh viên`,
                    value: cls.id,
                    data: cls
                })),
                hasMore: data.meta.current_page < data.meta.total_pages, // bạn cần trả về từ API
                additional: {
                    page: page + 1,
                },
            };
        } catch (e) {
            console.log(e);
        }

    };

    return (
        <AsyncPaginate
            value={value}
            loadOptions={loadOptions}
            onChange={(selected) => {
                setValue(selected);
                handleClassSelection(selected);
            }}
            components={customComponents}
            placeholder="-- Tìm lớp học --"
            additional={{
                page: 1,
            }}
            debounceTimeout={500}
            loadingMessage={() => 'Đang tải...'}
            noOptionsMessage={() => 'Không tìm thấy dữ liệu phù hợp'}
        />
    );
};

export default SelectWithPagination;
