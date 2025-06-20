
export const getInitials = (str: string) => {
    return str.split(' ').filter(item => item !== '').map(item => item[0].toLocaleUpperCase()).join('');
}

export const formatToInputDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
}

export const formatToDisplayDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}


export const normalizeString = (str: string) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D')
        .toLowerCase()
        .trim();
}