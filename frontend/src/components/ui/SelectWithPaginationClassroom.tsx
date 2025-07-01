import { AsyncPaginate } from 'react-select-async-paginate';
import { getClassrooms } from '../../services/classroomService';

const SelectWithPaginationClassroom = ({
    value,
    onChange,
}: {
    value: any;
    onChange: (val: any) => void;
}) => {
    const loadOptions = async (
        search: string,
        _loadedOptions: any,
        additional?: { page: number }
    ): Promise<any> => {
        const page = additional?.page ?? 1;

        try {
            const response = await getClassrooms(search, page);
            const data = response.data;

            return {
                options: data.classrooms.map((cls: any) => ({
                    label: cls.name,
                    value: cls.id,
                })),
                hasMore: data.meta.current_page < data.meta.total_pages,
                additional: {
                    page: page + 1,
                },
            };
        } catch (error) {
            console.error(error);
            return {
                options: [],
                hasMore: false,
                additional: {
                    page: page + 1,
                },
            };
        }
    };


    return (
        <AsyncPaginate
            isClearable
            value={value}
            loadOptions={loadOptions}
            onChange={onChange}
            placeholder="-- Tìm phòng học --"
            additional={{ page: 1 }}
            debounceTimeout={500}
            loadingMessage={() => 'Đang tải...'}
            noOptionsMessage={() => 'Không tìm thấy dữ liệu phù hợp'}
        />
    );
};

export default SelectWithPaginationClassroom;
