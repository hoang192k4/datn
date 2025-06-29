import { useEffect, useState } from "react";
import { getListSubjects } from "../../services/docmentSubjectService";
import { AsyncPaginate } from "react-select-async-paginate";

interface Selected {
    value: number,
    label: string
}
interface SelectWithPaginationSubjectProps {
    value: Selected | null;
    handleSelectedSubject: (selected: Selected) => void;
}
const SelectWithPaginationSubject = ({ value: propValue, handleSelectedSubject }: SelectWithPaginationSubjectProps) => {
    const [value, setValue] = useState<Selected | null>(null);

    const customComponents = {
        LoadingIndicator: () => null,
    };
    const loadOptions = async (search: any, _loadedOptions: any, { page }: { page: number } = { page: 1 }): Promise<any> => {
        try {
            const response = await getListSubjects(search, page);
            const data = response.data;
            return {
                options: data.subjects.map((subjects: any) => ({
                    label: `${subjects.name} - Số tín chỉ ${subjects.credit}`,
                    value: subjects.id
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
                    handleSelectedSubject(selected as Selected);
                }}
                components={customComponents}
                placeholder="-- Tìm Môn Học --"
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

export default SelectWithPaginationSubject