import { useEffect, useState } from "react";
import { AsyncPaginate } from "react-select-async-paginate";
import { getListClasses } from "../../services/classServices";
interface Selected {
    value: number,
    label: string
}
interface SelectWithPaginationClassProps {
    value: Selected | null;
    handleSelectedClass: (selected: Selected) => void;
}
const SelectWithPaginationClass = ({
    value: propValue,
    handleSelectedClass
}: SelectWithPaginationClassProps) => {
    const [value, setValue] = useState<Selected | null>(null);

    const customComponents = {
        LoadingIndicator: () => null,
    };
    const loadOptions = async (search: any, _loadedOptions: any, { page }: { page: number } = { page: 1 }): Promise<any> => {
        try {
            const response = await getListClasses(search, page);
            const data = response.data;
            return {
                options: data.classes.map((item: any) => ({
                    label: `${item.name}`,
                    value: item.id
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
        if (propValue) {
            setValue(propValue);
        } else {
            setValue(null);
        }
    }, [propValue]);
    return (
        <>
            <AsyncPaginate
                value={value}
                loadOptions={loadOptions}
                onChange={(selected) => {
                    setValue(selected);
                    handleSelectedClass(selected as Selected);
                }}
                components={customComponents}
                placeholder="-- Tìm Lớp Chính Khóa --"
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

export default SelectWithPaginationClass