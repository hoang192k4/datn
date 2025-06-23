
export const getInitials = (str: string) => {
    return str.split(' ').filter(item => item !== '').map(item => item[0].toLocaleUpperCase()).join('');
}

export const formateYearMonthDay = (dateStr: string) => {
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
}

export const formatDayMonthYear = (dateStr: string) => {
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
}