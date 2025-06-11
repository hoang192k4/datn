
export const getInitials = (str: string) => {
    return str.split(' ').filter(item => item !== '').map(item => item[0].toLocaleUpperCase()).join('');
}